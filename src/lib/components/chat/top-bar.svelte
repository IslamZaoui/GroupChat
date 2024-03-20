<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import SettingsIcon from 'lucide-svelte/icons/settings';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { buttonVariants } from '../ui/button';
	import { getAvatar } from '@/utils';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import ChangePasswordForm from '@/forms/change-password-form.svelte';
	import ChangeUsernameForm from '@/forms/change-username-form.svelte';
	import ChangeAvatarForm from '@/forms/change-avatar-form.svelte';
	import { writable, type Writable } from 'svelte/store';
	import Logout from 'lucide-svelte/icons/log-out';
	import { pb } from '@/pocketbase';
	import {  onMount } from 'svelte';
	import Verified from 'lucide-svelte/icons/badge-check';

	export let user: User;

	let optionDialogStatus: Writable<boolean> = writable(false);

	onMount(async () => {
		try {
			 await pb.collection('users').subscribe<User>(user.id, (e) => {
				const userData = e.record;
				if (e.action === 'update') user = userData;
			});
		} catch (error) {
			console.error(error);
		}
	});

</script>

<div class="flex h-20 w-full items-center justify-between border-b p-4">
	<div class="flex items-center gap-2">
		<Avatar.Root class="h-14 w-14">
			<Avatar.Image loading="lazy" src={getAvatar(user.id, user.avatar)} alt={user.username} />
			<Avatar.Fallback>{user.username.toUpperCase().substring(0, 2)}</Avatar.Fallback>
		</Avatar.Root>
		<div class="flex flex-col">
			<div class="flex items-center gap-1 font-medium">
				<span>{user.username}</span>
				{#if user.verified}
					<Verified size={16} class="text-blue-600" />
				{/if}
			</div>
			<span class="text-xs">Joined {new Date(user.created).toLocaleDateString()}</span>
			{#if user.isBanned}
				<span class="text-xs text-red-500">Your account has been banned</span>
			{/if}
		</div>
	</div>
	<div>
		<a
			href="/logout"
			class={buttonVariants({ variant: 'ghost' })}
			on:click={async () => await pb.realtime.unsubscribe('*')}
			><Logout size={20} class="text-muted-foreground" /></a
		>
		<Dialog.Root bind:open={$optionDialogStatus}>
			<Dialog.Trigger class={buttonVariants({ variant: 'ghost' })}>
				<SettingsIcon size={20} class="text-muted-foreground" />
			</Dialog.Trigger>
			<Dialog.Content>
				<Tabs.Root value="password" class="p-4">
					<Tabs.List class="w-full">
						<Tabs.Trigger value="password">Change Password</Tabs.Trigger>
						<Tabs.Trigger value="username">Change Username</Tabs.Trigger>
						<Tabs.Trigger value="avatar">Change Avatar</Tabs.Trigger>
					</Tabs.List>
					<Tabs.Content value="password">
						<ChangePasswordForm {optionDialogStatus} />
					</Tabs.Content>
					<Tabs.Content value="username">
						<ChangeUsernameForm {optionDialogStatus} />
					</Tabs.Content>
					<Tabs.Content value="avatar">
						<ChangeAvatarForm {optionDialogStatus} />
					</Tabs.Content>
				</Tabs.Root>
			</Dialog.Content>
		</Dialog.Root>
	</div>
</div>
