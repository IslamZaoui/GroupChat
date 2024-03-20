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

export const messageSchema = z.object({
    content: z
        .string({ required_error: 'Message is required' })
        .min(1, { message: 'Message must be at least 1 character' })
        .max(255, { message: 'Message must be at most 255 characters' })
        .trim(),

    attachment: z
        .instanceof(File, { message: 'Please upload a file.' })
        .refine((f) => f.size < 5_000_000, 'Max 5 MB upload size.')
        .optional()
})

export type MessageSchema = typeof messageSchema

export const changeImage = z.object({
    avatar: z.string({ required_error: 'Image URL is required' }).url({
        message: 'Image URL is invalid'
    })
})

export type ChangeImage = typeof changeImage

export const changeUsername = z.object({
    username: z
        .string({ required_error: 'Username is required' })
        .regex(/^[a-zA-Z0-9\.\-_]+$/, { message: 'Username must be alphanumeric' })
        .min(5, { message: 'Username must be at least 5 characters' })
        .max(16, { message: 'Username must be at most 16 characters' })
        .trim()
})

export type ChangeUsername = typeof changeUsername

export const changePassword = z.object({
    oldPassword: z
        .string({ required_error: 'Old Password is required' })
        .min(8, { message: 'Old Password must be at least 8 characters' })
        .max(16, { message: 'Old Password must be at most 16 characters' })
        .trim(),
    password: z
        .string({ required_error: 'Password is required' })
        .min(8, { message: 'Password must be at least 8 characters' })
        .max(16, { message: 'Password must be at most 16 characters' })
        .trim(),
    passwordConfirm: z
        .string({ required_error: 'Confirm password is required' })
        .min(8, { message: 'Confirm Password must be at least 8 characters' })
        .max(16, { message: 'Confirm Password must be at most 16 characters' })
        .trim()
}).superRefine(({ passwordConfirm, password }, ctx) => {
    if (passwordConfirm !== password) {
        ctx.addIssue({
            code: "custom",
            message: "The passwords did not match"
        });
    }
});

export type ChangePassword = typeof changePassword