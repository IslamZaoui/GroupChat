type User = {
    id: string
    username: string
    avatar: string
    isBanned: boolean
    isOnline: boolean
    verified: boolean
    created: string
    updated: string
}

type Message = {
    id: string
    user: string
    content: string
    attachment: string
    created: string
    updated: string
    expand: {
        user: User
    }
}