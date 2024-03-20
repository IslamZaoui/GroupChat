<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { LayoutData } from './$types';
	import { pb } from '@/pocketbase';

	export let data: LayoutData;

	let unsub: () => void;

	onMount(async () => {
		if (data.user) {
			try {
				unsub = await pb.collection('users').subscribe<User>(data.user.id, () => {});
			} catch (e) {
				console.error(e);
			}
		}
	});

	onDestroy(() => {
		if (unsub) unsub();
	});
</script>

<slot />
