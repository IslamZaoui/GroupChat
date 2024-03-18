<script lang="ts">
	import { onMount } from 'svelte';
	import MessageContainer from './message-container.svelte';
	import { messageListElement } from './store';

	export let messages: Message[];
	export let thisUserId: string;

	export function scrollChatBottom(behavior?: ScrollBehavior): void {
		$messageListElement.scrollTo({ top: $messageListElement.scrollHeight, behavior });
	}

	onMount(() => {
		scrollChatBottom('instant');
	});
</script>

<div
	class="flex h-full w-full flex-col overflow-y-auto overflow-x-hidden"
	bind:this={$messageListElement}
>
	{#each messages as message}
		<MessageContainer {message} {thisUserId} />
	{/each}
</div>
