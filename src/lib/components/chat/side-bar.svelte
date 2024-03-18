<script lang="ts">
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import UserView from './user-view.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';

	export let onlineUsers: User[];
	export let isCollapsed: boolean;
</script>

<nav class="flex flex-col items-center justify-start">
	<header class="flex w-full items-center justify-start gap-2 p-3">
		<h3 class="scroll-m-20 text-2xl font-bold tracking-tight">Users</h3>
		<span class="text-2xl text-muted-foreground">({onlineUsers.length})</span>
	</header>
	<Separator class="my-2" />
	<!--Users list-->
	<ScrollArea class="h-[520px] w-full p-2">
		{#each onlineUsers as userData}
			<UserView {userData} {isCollapsed} />
		{/each}
	</ScrollArea>
</nav>
