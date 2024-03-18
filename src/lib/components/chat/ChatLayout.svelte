<script lang="ts">
	import MessageList from './message-list.svelte';
	import { browser } from '$app/environment';
	import * as Resizable from '$lib/components/ui/resizable';
	import SideBar from './side-bar.svelte';
	import BotBar from './bot-bar.svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms/client';
	import type { MessageSchema } from '@/forms/schema';

	export let defaultLayout: [number, number] = [30, 70];
	export let defaultCollapsed = false;

	let isCollapsed = defaultCollapsed;

	function onLayoutChange(sizes: number[]) {
		document.cookie = `PaneForge:layout=${JSON.stringify(sizes)}`;
	}

	function onCollapse() {
		isCollapsed = true;
		document.cookie = `PaneForge:collapsed=${true}`;
	}

	function onExpand() {
		isCollapsed = false;
		document.cookie = `PaneForge:collapsed=${false}`;
	}

	export let onlineUsers: User[];
	export let messages: Message[] = [];
	export let thisUserId: string;
	export let data: SuperValidated<Infer<MessageSchema>>;

	let windowWidth: number;
	let isMobile: boolean;
	$: if (browser) isMobile = windowWidth < 1100;
</script>

<svelte:window bind:innerWidth={windowWidth} />

<Resizable.PaneGroup direction="horizontal" class="h-full items-stretch" {onLayoutChange}>
	{#if !isMobile}
		<Resizable.Pane
			defaultSize={defaultLayout[0]}
			maxSize={30}
			minSize={20}
			collapsible
			collapsedSize={12}
			{onCollapse}
			{onExpand}
		>
			<SideBar {isCollapsed} {onlineUsers} />
		</Resizable.Pane>
		<Resizable.Handle withHandle />
	{/if}
	<Resizable.Pane defaultSize={defaultLayout[1]}>
		<div class="flex h-full w-full flex-col justify-between">
			<MessageList {messages} {thisUserId} />
			<BotBar {data} />
		</div>
	</Resizable.Pane>
</Resizable.PaneGroup>
