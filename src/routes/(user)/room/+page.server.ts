import { superValidate, withFiles } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { messageSchema } from '@/forms/schema';
import { fail } from '@sveltejs/kit';
import { ClientResponseError } from 'pocketbase';

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
        onlineUsers = await event.locals.pb.collection('users').getFullList({
            filter: 'isOnline = true',
            sort: 'updated',
            $autoCancel: false
        });
    }
    catch (e) { console.log(e); }

    //messages
    let messages: Message[] = [];

    try {
        messages = await event.locals.pb.collection('messages').getFullList({
            sort: 'created',
            expand: 'user',
        })
    }
    catch (e) { console.log(e); }


    return {
        layout, collapsed, onlineUsers, messages,
        form: await superValidate(zod(messageSchema)),
    };
}) satisfies PageServerLoad;

export const actions: Actions = {
    sendMessage: async ({ request, locals, cookies }) => {
        const form = await superValidate(request, zod(messageSchema));

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
            if (e instanceof ClientResponseError) {
                if (e.response.data['content'])
                    form.errors.content = [e.response.data['content'].message]
                if (e.response.data['attachment'])
                    form.errors.attachment = [e.response.data['attachment'].message]
                console.log(e.response)
            }
        }

        return withFiles({ form });
    }
};