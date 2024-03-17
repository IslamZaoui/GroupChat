<script lang="ts">
	import '../app.pcss';
	import { Toaster } from '$lib/components/ui/sonner';
	import { toast } from 'svelte-sonner';
	import { getFlash } from 'sveltekit-flash-message';
	import { page } from '$app/stores';
	import { onMount, onDestroy } from 'svelte';
	import { pb } from '@/pocketbase';

	export let data;

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

	let unsub: () => void;

	onMount(async () => {
		if (data.user) {
			unsub = await pb.collection('users').subscribe(data.user.id, ({}) => {});
		}
	});

	onDestroy(async () => {
		if (unsub) unsub();
	});
</script>

<Toaster closeButton richColors />
<slot />
