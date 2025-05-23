import { create } from 'zustand';

export const useHideStore = create<{
    hide: boolean;
    setHide: (hide: boolean) => void;
}>((set) => ({
    hide: false,
    setHide: (hide) => set({ hide }),
}));