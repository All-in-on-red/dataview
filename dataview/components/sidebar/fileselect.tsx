import { create } from 'zustand'

interface SelectedFile{
    file: string
    set: (key: string) => void
}
const useSelectedFile = create<SelectedFile>((set) => ({
    file: "",
    set: (key) => set((state) => ({file:state.file}))
}))