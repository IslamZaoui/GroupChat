import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
    if (!locals.user) {
        redirect(302, '/')
    }
    return {};
}) satisfies LayoutServerLoad;