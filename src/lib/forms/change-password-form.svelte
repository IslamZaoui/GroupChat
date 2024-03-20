<script lang="ts">
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms/client';
	import { type ChangePassword, changePassword } from './schema';
	import * as Form from '$lib/components/ui/form';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '@/components/ui/input';
	import { page } from '$app/stores';
	import type { Writable } from 'svelte/store';

	let data: SuperValidated<Infer<ChangePassword>> = $page.data.changePasswordForm;
	export let optionDialogStatus: Writable<boolean>;
	const form = superForm(data, {
		validators: zodClient(changePassword),
		onResult: (e) => {
			if (e.result.type === 'success') $optionDialogStatus = false;
		}
	});
	const { form: formData, enhance } = form;
</script>

<form action="?/changePassword" use:enhance method="POST">
	<Form.Field {form} name="oldPassword">
		<Form.Control let:attrs>
			<Form.Label>Old password</Form.Label>
			<Input {...attrs} bind:value={$formData.oldPassword} type="password" />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="password">
		<Form.Control let:attrs>
			<Form.Label>Password</Form.Label>
			<Input {...attrs} bind:value={$formData.password} type="password" />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="passwordConfirm">
		<Form.Control let:attrs>
			<Form.Label>Old Password</Form.Label>
			<Input {...attrs} bind:value={$formData.passwordConfirm} type="password" />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button class="w-full">Change Password</Form.Button>
</form>
