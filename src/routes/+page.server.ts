import type { Actions, PageServerLoad } from "./$types";
import { superValidate } from "sveltekit-superforms";
import { authSchema } from "@/forms/schema";
import { zod } from "sveltekit-superforms/adapters";
import { fail } from "@sveltejs/kit";
import { redirect, setFlash } from "sveltekit-flash-message/server";
import { ClientResponseError } from "pocketbase";

export const load: PageServerLoad = async ({ locals }) => {
    if (locals.user) {
        redirect(302, '/room')
    }
    return {
        form: await superValidate(zod(authSchema)),
    };
};

export const actions: Actions = {
    default: async ({ request, locals, cookies }) => {
        const form = await superValidate(request, zod(authSchema));

        if (!form.valid) {
            return fail(400, {
                form,
            });
        }

        try {
            if (form.data.auth_method === 'register')
                await locals.pb.collection('users').create({
                    ...form.data,
                    passwordConfirm: form.data.password
                })
            await locals.pb.collection('users').authWithPassword(form.data.username, form.data.password);
        }
        catch (e) {
            if (e instanceof ClientResponseError) {
                if (e.response.message === "Failed to authenticate.")
                    setFlash({ message: 'Invalid username or password', type: 'error' }, cookies);
                else {
                    if (e.response.data['username'])
                        form.errors.username = [e.response.data['username'].message]
                    if (e.response.data['password'])
                        form.errors.username = [e.response.data['username'].message]
                }
            }
            return fail(400, {
                form,
            });
        }

        redirect('/', { message: 'Logged in successfully', type: 'success' }, cookies);
    }
};