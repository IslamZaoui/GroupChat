import { dev } from '$app/environment'
import { createInstance } from '$lib/pocketbase'
import type { Handle } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

const pbHook: Handle = async ({ event, resolve }) => {
    const pb = createInstance()
    pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '')

    try {
        if (pb.authStore.isValid) {
            await pb.collection('users').authRefresh()
        }
    } catch (_) {
        pb.authStore.clear()
    }

    event.locals.pb = pb
    event.locals.user = pb.authStore.model as User
    event.locals.isAdmin = pb.authStore.isAdmin

    const response = await resolve(event)
    response.headers.append(
        'set-cookie',
        pb.authStore.exportToCookie({ httpOnly: false })
    )

    return response
}

export const handle: Handle = sequence(pbHook);