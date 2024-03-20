<script lang="ts">
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms/client';
	import { type ChangeUsername, changeUsername } from './schema';
	import * as Form from '$lib/components/ui/form';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '@/components/ui/input';
	import { page } from '$app/stores';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import type { Writable } from 'svelte/store';

	let data: SuperValidated<Infer<ChangeUsername>> = $page.data.changeUsernameForm;

	export let optionDialogStatus: Writable<boolean>;
	const form = superForm(data, {
		validators: zodClient(changeUsername),
		onResult: (e) => {
			if (e.result.type === 'success') $optionDialogStatus = false;
		}
	});
	const { form: formData, enhance, delayed } = form;
</script>

<form action="?/changeUsername" use:enhance method="POST">
	<Form.Field {form} name="username">
		<Form.Control let:attrs>
			<Form.Label>Username</Form.Label>
			<Input {...attrs} bind:value={$formData.username} disabled={$delayed} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button class="w-full" disabled={$delayed}>
		{#if $delayed}
			<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
		{/if}
		Change username
	</Form.Button>
</form>
