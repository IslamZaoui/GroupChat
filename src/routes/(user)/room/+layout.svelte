<script lang="ts">
	import AlartIcon from 'lucide-svelte/icons/triangle-alert';
	import * as Dialog from '$lib/components/ui/dialog';
</script>

<slot />

<Dialog.Root open={true}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title class="flex items-center gap-2"
				><AlartIcon /> <span>Head up!</span></Dialog.Title
			>
			<Dialog.Description>
				If you can't see the messages you sent you should refresh.
			</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
