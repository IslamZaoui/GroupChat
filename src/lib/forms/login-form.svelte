<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { cn } from '$lib/utils.js';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms/client';
	import { authSchema, type AuthSchema } from './schema';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let className: string | undefined | null = undefined;
	export { className as class };
	export let data: SuperValidated<Infer<AuthSchema>>;

	const form = superForm(data, {
		validators: zodClient(authSchema)
	});

	const { form: formData, enhance, delayed } = form;
</script>

<div class={cn('grid gap-6', className)} {...$$restProps}>
	<form method="POST" use:enhance>
		<Form.Field {form} name="username">
			<Form.Control let:attrs>
				<Form.Label>Username</Form.Label>
				<Input {...attrs} bind:value={$formData.username} type="text" />
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="password">
			<Form.Control let:attrs>
				<Form.Label>Password</Form.Label>
				<Input {...attrs} bind:value={$formData.password} type="password" />
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>
		<div class="flex items-center justify-between gap-4 pt-4">
			<Button type="submit" name="auth_method" value="login" disabled={$delayed} class="w-full">
				{#if $delayed}
					<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				Login
			</Button>
			<Button type="submit" name="auth_method" value="register" disabled={$delayed} class="w-full">
				{#if $delayed}
					<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				Register
			</Button>
		</div>
	</form>
</div>
