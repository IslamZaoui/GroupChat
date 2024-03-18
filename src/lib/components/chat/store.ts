import { writable, type Writable } from "svelte/store";

export const messageListElement: Writable<HTMLElement> = writable()