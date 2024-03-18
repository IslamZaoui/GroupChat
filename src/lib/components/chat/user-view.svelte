<script lang="ts">
	import { getAvatar } from '@/utils';
	import * as Avatar from '$lib/components/ui/avatar/index.js';

	export let isCollapsed: boolean;
	export let userData: User;
</script>

<div class="flex w-full items-center justify-{isCollapsed ? 'center' : 'start'} gap-2 p-2">
	<div class="relative inline-block">
		<span class="absolute -right-1 -top-1 z-10 h-5 w-5 rounded-full bg-{userData.isOnline? 'green' : 'red'}-500" />
		<Avatar.Root class="h-14 w-14">
			<Avatar.Image src={getAvatar(userData.id, userData.avatar)} alt={userData.username} />
			<Avatar.Fallback>{userData.username.toUpperCase().substring(0, 2)}</Avatar.Fallback>
		</Avatar.Root>
	</div>
	{#if !isCollapsed}
		<span class="text-xl">{userData.username}</span>
	{/if}
</div>
