import { superValidate, withFiles } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { changeImage, changePassword, changeUsername, messageSchema } from '@/forms/schema';
import { fail } from '@sveltejs/kit';
import { ClientResponseError } from 'pocketbase';
import { extractError } from '@/index';
import { setFlash } from 'sveltekit-flash-message/server';

export const load = (async (event) => {
    //layout
    const layoutCookie = event.cookies.get("PaneForge:layout");
    const collapsedCookie = event.cookies.get("PaneForge:collapsed");

    let layout: [number, number] | undefined = undefined;
    let collapsed: boolean | undefined = undefined;

    layoutCookie && (layout = JSON.parse(layoutCookie));
    collapsedCookie && (collapsed = JSON.parse(collapsedCookie));

    //onlineUsers
    let onlineUsers: User[] = [];

    try {
        onlineUsers = await event.locals.pb.collection('users').getFullList<User>({
            filter: 'isOnline = true',
            sort: 'updated',
            $autoCancel: false
        });
    }
    catch (e) { console.error(e); }

    //messages
    let messages: Message[] = [];

    try {
        messages = await event.locals.pb.collection('messages').getFullList<Message>({
            sort: 'created',
            expand: 'user',
        })
    }
    catch (e) { console.error(e); }


    return {
        layout, collapsed, onlineUsers, messages,
        sendMessageForm: await superValidate(zod(messageSchema)),
        changePasswordForm: await superValidate(zod(changePassword)),
        changeUsernameForm: await superValidate(zod(changeUsername)),
        changeImageForm: await superValidate(zod(changeImage))
    };
}) satisfies PageServerLoad;

export const actions: Actions = {
    sendMessage: async ({ request, locals, cookies }) => {
        const form = await superValidate(request, zod(messageSchema));

        if (locals.user?.isBanned) {
            setFlash({ message: 'You are banned from sending messages.', type: 'error' }, cookies);
            return fail(400, withFiles({ form }));
        }

        if (!form.valid) {
            console.log("submition faild")
            return fail(400, withFiles({ form }));
        }

        try {
            await locals.pb.collection('messages').create({
                user: locals.user?.id,
                content: form.data.content,
                attachment: form.data.attachment
            })
        }
        catch (e) {
            console.error(e)
            if (e instanceof ClientResponseError) {
                extractError(form.errors, e.response.data);
            }
            return fail(400, { sendMessageForm: form });
        }

        return withFiles({
            sendMessageForm: form
        });
    },

    changePassword: async ({ request, locals, cookies }) => {
        if (!locals.user) return fail(401, { message: "Unauthorized" });

        const form = await superValidate(request, zod(changePassword));

        if (!form.valid) {
            return fail(400, { form });
        }

        try {
            await locals.pb.collection('users').update(locals.user?.id, form.data)
            setFlash({ message: 'Password changed successfully', type: 'success' }, cookies);
        }
        catch (e) {
            console.error(e)
            if (e instanceof ClientResponseError) {
                extractError(form.errors, e.response.data);
            }
            return fail(400, { changePasswordForm: form });
        }

        return {
            changePasswordForm: form
        };
    },

    changeUsername: async ({ request, locals, cookies }) => {
        if (!locals.user) return fail(401, { message: "Unauthorized" });

        const form = await superValidate(request, zod(changeUsername));

        if (!form.valid) {
            return fail(400, { form });
        }

        try {
            await locals.pb.collection('users').update(locals.user?.id, form.data)
            setFlash({ message: 'Username changed successfully', type: 'success' }, cookies);
        }
        catch (e) {
            console.error(e)
            if (e instanceof ClientResponseError) {
                extractError(form.errors, e.response.data);
            }
            return fail(400, { changeUsernameForm: form });
        }

        return {
            changeUsernameForm: form
        };
    },

    changeImage: async ({ request, locals, cookies }) => {
        if (!locals.user) return fail(401, { message: "Unauthorized" });

        const form = await superValidate(request, zod(changeImage));

        if (!form.valid) {
            return fail(400, { form });
        }

        try {
            await locals.pb.collection('users').update(locals.user?.id, form.data)
            setFlash({ message: 'Avatar changed successfully', type: 'success' }, cookies);
        }
        catch (e) {
            console.error(e)
            if (e instanceof ClientResponseError) {
                extractError(form.errors, e.response.data);
            }
            return fail(400, { changeImageForm: form });
        }

        return {
            changeImageForm: form
        };
    }
};