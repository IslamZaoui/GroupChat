<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import PlusIcon from 'lucide-svelte/icons/circle-plus';
	import * as Form from '$lib/components/ui/form';
	import { messageSchema, type MessageSchema } from '@/forms/schema';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms/client';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { isImageOrAudio } from '@/index';
	import Image from 'lucide-svelte/icons/file-image';
	import Audio from 'lucide-svelte/icons/file-audio';
	import Like from 'lucide-svelte/icons/thumbs-up';
	import { page } from '$app/stores';

	let data: SuperValidated<Infer<MessageSchema>> = $page.data.sendMessageForm;

	const form = superForm(data, {
		validators: zodClient(messageSchema)
	});

	const { form: formData, enhance, delayed, errors } = form;

	const handleKeyPress = (event: KeyboardEvent) => {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			form.submit();
		}
	};

	let inputElement: HTMLInputElement;
	const handleFileSelect = () => {
		inputElement.click();
	};
</script>

<div class="flex w-full items-center justify-between gap-2 p-2">
	<div class="flex w-full">
		<div class="flex w-full items-center justify-between gap-2 p-2">
			<form
				class="flex h-min w-full items-center gap-2"
				use:enhance
				method="POST"
				action="?/sendMessage"
				enctype="multipart/form-data"
			>
				<input
					bind:this={inputElement}
					type="file"
					name="attachment"
					class="hidden"
					accept="image/*, audio/*"
					on:input={(e) => ($formData.attachment = e.currentTarget.files?.item(0) ?? undefined)}
				/>
				<Button variant="ghost" type="button" on:click={handleFileSelect}
					><PlusIcon size={20} class="text-muted-foreground" /></Button
				>
				{#if $formData.attachment}
					<Badge class="space-x-2">
						{#if isImageOrAudio($formData.attachment.name)}
							<Image />
						{:else}
							<Audio />
						{/if}
						<span class="truncate max-w-[100px]">{$formData.attachment.name}</span>
					</Badge>
				{/if}
				<Form.Field {form} name="content" class="w-full">
					<Form.Control let:attrs>
						<Textarea
							autofocus
							{...attrs}
							on:keypress={handleKeyPress}
							name="content"
							bind:value={$formData.content}
							placeholder={$errors.content?.join(', ') ?? 'Type a message...'}
							class="flex min-h-9 w-full resize-none items-center overflow-hidden rounded border bg-background"
							rows={1}
							disabled={$delayed}
						/>
					</Form.Control>
				</Form.Field>
				<Button variant="ghost" type="submit" on:click={() => ($formData.content += '👍')}
					><Like size={20} class="text-muted-foreground" /></Button
				>
			</form>
		</div>
	</div>
</div>
