<script lang="ts">
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms/client';
	import { type ChangeImage, changeImage } from './schema';
	import * as Form from '$lib/components/ui/form';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '@/components/ui/input';
	import { page } from '$app/stores';
	import type { Writable } from 'svelte/store';

	let data: SuperValidated<Infer<ChangeImage>> = $page.data.changeImageForm;
	export let optionDialogStatus: Writable<boolean>;
	const form = superForm(data, {
		validators: zodClient(changeImage),
		onResult: (e) => {
			if (e.result.type === 'success') $optionDialogStatus = false;
		}
	});
	const { form: formData, enhance } = form;
</script>

<form action="?/changeImage" use:enhance method="POST">
	<Form.Field {form} name="avatar">
		<Form.Control let:attrs>
			<Form.Label>Avatar URL</Form.Label>
			<Input {...attrs} bind:value={$formData.avatar} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button class="w-full">Change avatar</Form.Button>
</form>
