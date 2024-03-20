<script lang="ts">
	import { getAvatar } from '@/index';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import Verified from 'lucide-svelte/icons/badge-check';

	export let isCollapsed: boolean;
	export let userData: User;
</script>

<div class="flex w-full items-center justify-{isCollapsed ? 'center' : 'start'} gap-2 p-2">
	<div class="relative inline-block">
		<span
			class="absolute -right-1 -top-1 z-10 h-5 w-5 rounded-full {userData.isOnline
				? 'bg-green-500'
				: 'bg-red-500'}"
		/>
		<Avatar.Root class="h-14 w-14">
			<Avatar.Image
				loading="lazy"
				src={getAvatar(userData.id, userData.avatar)}
				alt={userData.username}
			/>
			<Avatar.Fallback>{userData.username.toUpperCase().substring(0, 2)}</Avatar.Fallback>
		</Avatar.Root>
	</div>
	{#if !isCollapsed}
		<span class="flex items-center gap-1 text-xl">
			<span class="font-medium {userData.isBanned ? 'text-red-500' : ''}">{userData.username}</span>
			{#if userData.verified}
				<Verified size={20} class=" text-blue-600" />
			{/if}
		</span>
	{/if}
</div>
