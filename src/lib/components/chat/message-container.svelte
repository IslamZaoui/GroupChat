<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { getAvatar, getMessageAttachment } from '@/utils';

	export let message: Message;
	export let thisUserId: string;

	function isMyMessage() {
		return message.expand.user.id === thisUserId;
	}

	let attachment: string = getMessageAttachment(message.id, message.attachment);
	let attachmentType: 'image' | 'audio' | null = null;

	if (attachment) {
		const extension = attachment.split('.').pop()?.toLowerCase();
		if (extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'gif') {
			attachmentType = 'image';
		} else if (extension === 'mp3' || extension === 'wav' || extension === 'ogg') {
			attachmentType = 'audio';
		}
	}
</script>

<div class="flex flex-col items-{isMyMessage() ? 'end' : 'start'} gap-2 whitespace-pre-wrap p-4">
	<div class="flex items-center gap-3 {isMyMessage() ? 'flex-row-reverse' : ''}">
		<span
			class="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full"
		>
			<Avatar.Root class="aspect-square h-full w-full">
				<Avatar.Image
					src={getAvatar(message.expand.user.id, message.expand.user.avatar)}
					alt={message.expand.user.username}
				/>
				<Avatar.Fallback>{message.expand.user.username}</Avatar.Fallback>
			</Avatar.Root>
		</span>
		<div class="flex flex-col items-{isMyMessage() ? 'end' : 'start'}">
			<span class="max-w-xs break-words rounded-md bg-accent p-3">{message.content}</span>
			{#if attachmentType === 'image'}
				<img src={attachment} alt="Attachment" class="mt-2 h-auto max-w-full" />
			{:else if attachmentType === 'audio'}
				<audio controls class="mt-2">
					<source src={attachment} type="audio/mpeg" />
					Your browser does not support the audio element.
				</audio>
			{/if}
		</div>
	</div>
</div>
