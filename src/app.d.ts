declare global {
	namespace App {
		interface Error {
			message: string,
			details?: string
		}
		interface Locals {
			pb: import('pocketbase').default
			user: User | undefined
		}
		interface PageData {
			flash?: { type: 'success' | 'error' | 'message' | 'warning' | 'info' | 'loading'; message: string; description?: string };
			user: User | undefined
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };