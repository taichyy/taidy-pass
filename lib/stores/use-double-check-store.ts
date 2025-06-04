import { create } from 'zustand';

export const useDoubleCheckStore = create<{
    open: Record<string, boolean>,
    setDoubleCheckOpen: (key: string, status: boolean) => void;
}>((set) => ({
    open: {},
    setDoubleCheckOpen: (key: string, status: boolean) => {
        useDoubleCheckStore.setState(prev => ({ open: { ...prev.open, [key]: status } }))
    }
}));