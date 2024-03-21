import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';
import PocketBase, { BaseAuthStore, cookieParse, type AuthModel } from 'pocketbase'

class CookieStore extends BaseAuthStore {
  constructor() {
    super();
    if (browser)
      this.loadFromCookie(document.cookie)
  }

  get token() {
    if (browser)
      try {
        const data = JSON.parse(cookieParse(document.cookie)['pb_auth']);
        return data.token
      } catch (_) { }

    return super.token;
  }

  get model() {
    if (browser)
      try {
        const data = JSON.parse(cookieParse(document.cookie)['pb_auth']);
        return data.model
      } catch (_) { }

    return super.model;
  }

  save(token: string, model: AuthModel | undefined) {
    super.save(token, model)

    if (browser)
      document.cookie = this.exportToCookie({ httpOnly: false })
  }

  clear() {
    super.clear()

    if (browser)
      document.cookie = this.exportToCookie({ httpOnly: false })
  }
}

export function createInstance(store?: CookieStore) {
  return new PocketBase(env.PUBLIC_POCKETBASE_URL, store)
}

export const pb = createInstance(new CookieStore())