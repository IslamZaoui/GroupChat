<script lang="ts">
	import '../app.pcss';
	import { Toaster } from '$lib/components/ui/sonner';
	import { toast } from 'svelte-sonner';
	import { getFlash } from 'sveltekit-flash-message';
	import { page } from '$app/stores';

	const flash = getFlash(page);

	$: if ($flash) {
		switch ($flash.type) {
			case 'success':
				toast.success($flash.message, { description: $flash.description });
				break;
			case 'error':
				toast.error($flash.message, { description: $flash.description });
				break;
			case 'message':
				toast($flash.message, { description: $flash.description });
				break;
			case 'warning':
				toast.warning($flash.message, { description: $flash.description });
				break;
			case 'info':
				toast.info($flash.message, { description: $flash.description });
				break;
			case 'loading':
				toast.loading($flash.message, { description: $flash.description });
				break;
		}
		$flash = undefined;
	}
</script>

<svelte:head>
	<title>Public Group Chat</title>
	<meta name="description" content="Public Group Chat" />
</svelte:head>

<Toaster closeButton richColors />
<slot />
