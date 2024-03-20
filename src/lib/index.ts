import { env } from "$env/dynamic/public";

export const getAvatar = (userid: string, avatar: string) => {
    if (avatar)
        return avatar
    else
        return `https://source.boringavatars.com/beam/160/${userid}`
}

export const getMessageAttachment = (id: string, attachment: string) => {
    return `${env.PUBLIC_POCKETBASE_URL}/api/files/r6tp41gjo2xojqx/${id}/${attachment}`
}

export function isImageOrAudio(fileName: string): string | null {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
    const audioExtensions = ['mp3', 'wav', 'ogg', 'aac', 'flac'];

    const extension = fileName.split('.').pop()?.toLowerCase();

    if (!extension) {
        return null;
    }

    if (imageExtensions.includes(extension)) {
        return 'image';
    } else if (audioExtensions.includes(extension)) {
        return 'audio';
    } else {
        return null;
    }
}

export function extractError(formErrors: any, errorResponse: any): void {
    for (const field of Object.keys(errorResponse)) {
        if (!formErrors[field]) {
            formErrors[field] = [];
        }
        if (!Array.isArray(errorResponse[field])) {
            formErrors[field] = [errorResponse[field].message];
        } else {
            errorResponse[field].forEach((value: any) => {
                formErrors[field].push(value.message);
            })
        }
    }
}