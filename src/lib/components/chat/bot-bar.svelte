<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Textarea } from '$lib/components/ui/textarea';
	import LikeIcon from 'lucide-svelte/icons/thumbs-up';
	import PlusIcon from 'lucide-svelte/icons/circle-plus';
	import * as Form from '$lib/components/ui/form';
	import { messageSchema, type MessageSchema } from '@/forms/schema';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms/client';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data: SuperValidated<Infer<MessageSchema>>;

	const form = superForm(data, {
		validators: zodClient(messageSchema)
	});

	const { form: formData, enhance } = form;

	const handleKeyPress = (event: KeyboardEvent) => {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			form.submit();
		}
	};

	let inputElement: HTMLInputElement;
	const handleFileSelect = (event: Event) => {
		inputElement.click();
	};
</script>

<div class="flex w-full items-center justify-between gap-2 p-2">
	<div class="flex w-full">
		<div class="flex w-full items-center justify-between gap-2 p-2">
			<form
				class="flex w-full items-end gap-2"
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
				<Form.Field {form} name="content" class="w-full">
					<Form.Control let:attrs>
						<Form.FieldErrors />
						<Textarea
							autofocus
							{...attrs}
							on:keypress={handleKeyPress}
							name="content"
							bind:value={$formData.content}
							placeholder="text...."
							class="flex min-h-9 w-full resize-none items-center overflow-hidden rounded border bg-background"
							rows={1}
						/>
					</Form.Control>
				</Form.Field>
			</form>
		</div>
	</div>
</div>
