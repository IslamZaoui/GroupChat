import z from 'zod'

export const authSchema = z.object({
    username: z
        .string({ required_error: 'Username is required' })
        .regex(/^[a-zA-Z0-9\.\-_]+$/, { message: 'Username must be alphanumeric' })
        .min(5, { message: 'Username must be at least 5 characters' })
        .max(16, { message: 'Username must be at most 16 characters' })
        .trim(),
    password: z
        .string({ required_error: 'Password is required' })
        .min(8, { message: 'Password must be at least 8 characters' })
        .max(16, { message: 'Password must be at most 16 characters' })
        .trim(),
    auth_method: z
        .literal('login')
        .or(z.literal('register')),
})

export type AuthSchema = typeof authSchema;