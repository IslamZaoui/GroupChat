<script lang="ts">
	import { pb } from '@/pocketbase';
	import { onMount, afterUpdate, onDestroy } from 'svelte';
	import type { PageData } from './$types';
	import ChatLayout from '@/components/chat/ChatLayout.svelte';
	import { messageListElement } from '@/components/chat/store';

	export let data: PageData;

	$: onlineUsers = data.onlineUsers;
	$: messages = data.messages;

	let unsub1: () => void;
	let unsub2: () => void;

	onMount(async () => {
		try {
			unsub1 = await pb.collection('users').subscribe<User>('*', (e) => {
				const updatedUser = e.record;
				switch (e.action) {
					case 'create':
						onlineUsers = [...onlineUsers, updatedUser];
						break;
					case 'update':
						if (updatedUser.isOnline) {
							const userIndex = onlineUsers.findIndex((user) => user.id === updatedUser.id);
							if (userIndex !== -1) {
								onlineUsers[userIndex] = updatedUser;
							}
						} else {
							onlineUsers = onlineUsers.filter((user) => user.id !== updatedUser.id);
						}
						break;
					case 'delete':
						onlineUsers = onlineUsers.filter((user) => user.id !== updatedUser.id);
						break;
					default:
						console.warn(`Unknown user action: ${e.action}`);
						break;
				}
			});
		} catch (e) {
			console.error(e);
		}

		try {
			unsub2 = await pb.collection('messages').subscribe<Message>(
				'*',
				(e) => {
					let message = e.record;
					console.log(message);
					switch (e.action) {
						case 'update':
							const messageIndex = messages.findIndex((msg) => msg.id === message.id);
							if (messageIndex !== -1) {
								messages[messageIndex] = message;
							}
							break;
						case 'delete':
							messages = messages.filter((msg) => msg.id !== message.id);
							break;
						case 'create':
							messages = [...messages, message];
							scrollChatBottom('smooth');
							break;
						default:
							console.warn(`Unknown message action: ${e.action}`);
					}
				},
				{
					expand: 'user'
				}
			);
		} catch (e) {
			console.error(e);
		}
	});

	export function scrollChatBottom(behavior?: ScrollBehavior): void {
		$messageListElement.scrollTo({ top: $messageListElement.scrollHeight, behavior });
	}

	onDestroy(() => {
		if (unsub1) unsub1();
		if (unsub2) unsub2();
	});

	afterUpdate(() => {
		scrollChatBottom('smooth');
	});
</script>

<main class="flex h-[calc(100dvh)] flex-col items-center justify-center gap-4 p-4 py-32 md:px-24">
	<div class="flex w-full max-w-5xl items-center justify-between">
		<span class="text-4xl font-bold">Chat Room</span>
	</div>

	<div class="z-10 h-[600px] w-full max-w-5xl rounded-lg border text-sm lg:flex">
		<ChatLayout
			defaultCollapsed={data.collapsed}
			defaultLayout={data.layout}
			{onlineUsers}
			{messages}
			user={data.user}
		/>
	</div>

	<div
		class="flex w-full max-w-5xl items-start justify-between text-xs text-muted-foreground md:text-sm"
	>
		<p class="max-w-[150px] sm:max-w-lg">
			Built by <a class="font-semibold" href="https://islamzaoui.top/" target="_blank"
				>Islam Zaoui</a
			>. To be used with
			<a class="font-semibold" href="https://kit.svelte.dev/" target="_blank">sveltekit</a>
			and
			<a class="font-semibold" href="https://www.shadcn-svelte.com/" target="_blank">shadcn</a>.
		</p>
		<p class="max-w-[150px] text-right sm:max-w-lg">
			Source code available on <a
				class="font-semibold"
				target="_blank"
				href="https://github.com/IslamZaoui/groupChat">GitHub</a
			>.
		</p>
	</div>
</main>
