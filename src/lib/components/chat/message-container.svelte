<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { pb } from '@/pocketbase';
	import { getAvatar, getMessageAttachment } from '@/index';
	import Verified from 'lucide-svelte/icons/badge-check';
	import { onDestroy, onMount } from 'svelte';

	export let message: Message;
	export let thisUserId: string;

	function isMyMessage() {
		return message.expand.user.id === thisUserId;
	}

	function getAttachmentType(attachment: string) {
		let attachmentType: 'image' | 'audio' | null = null;

		if (attachment) {
			const extension = attachment.split('.').pop()?.toLowerCase();
			if (
				extension === 'jpg' ||
				extension === 'jpeg' ||
				extension === 'png' ||
				extension === 'gif'
			) {
				attachmentType = 'image';
			} else if (extension === 'mp3' || extension === 'wav' || extension === 'ogg') {
				attachmentType = 'audio';
			}
		}

		return attachmentType;
	}

	let unsub: () => void;

	onMount(async () => {
		try {
			unsub = await pb.collection('users').subscribe<User>(message.expand.user.id, (e) => {
				const user = e.record;
				if (e.action === 'update') {
					message.expand.user = user;
				}
			});
		} catch (e) {
			console.error(e);
		}
	});

	onDestroy(() => {
		if (unsub) unsub();
	});
</script>

<div class="flex flex-col items-{isMyMessage() ? 'end' : 'start'} gap-2 whitespace-pre-wrap p-4">
	<div class="flex items-center gap-3 {isMyMessage() ? 'flex-row-reverse' : ''}">
		<span class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full">
			<Avatar.Root class="aspect-square h-full w-full">
				<Avatar.Image
					src={getAvatar(message.expand.user.id, message.expand.user.avatar)}
					alt={message.expand.user.username}
				/>
				<Avatar.Fallback>{message.expand.user.username}</Avatar.Fallback>
			</Avatar.Root>
		</span>
		<div class="flex flex-col items-{isMyMessage() ? 'end' : 'start'}">
			<div
				class="flex max-w-xs flex-col gap-2 break-words rounded-md items-{isMyMessage()
					? 'end'
					: 'start'} {message.expand.user.isBanned ? 'bg-red-700' : 'bg-accent'} p-3"
			>
				<span
					class="flex items-center gap-1 text-[12px] font-medium flex-{isMyMessage()
						? 'row-reverse'
						: ''}"
				>
					<span>{message.expand.user.username}</span>
					{#if message.expand.user.verified}
						<Verified size={16} class=" text-blue-600" />
					{/if}</span
				>
				<span class="max-w-[300px] break-words text-lg">{message.content}</span>
			</div>
			<div class="max-w-[300px]">
				{#if getAttachmentType(getMessageAttachment(message.id, message.attachment)) === 'image'}
					<img
						src={getMessageAttachment(message.id, message.attachment)}
						alt="Attachment"
						class="mt-2 h-auto max-w-full"
					/>
				{:else if getAttachmentType(getMessageAttachment(message.id, message.attachment)) === 'audio'}
					<audio controls class="mt-2">
						<source src={getMessageAttachment(message.id, message.attachment)} type="audio/mpeg" />
						Your browser does not support the audio element.
					</audio>
				{/if}
			</div>
		</div>
	</div>
</div>
