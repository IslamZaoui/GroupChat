import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
    if (locals.user) {
        locals.pb.authStore.clear()
        locals.user = undefined
    }
    redirect(307, '/')
};