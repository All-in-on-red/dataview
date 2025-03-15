import { create } from 'zustand'

export interface SelectedFile{
    file: string
    set: (key: string) => void
}
export const useSelectedFile = create<SelectedFile>((set) => ({
    file: "",
    set: (key) => set((state) => ({file:key}))
}))