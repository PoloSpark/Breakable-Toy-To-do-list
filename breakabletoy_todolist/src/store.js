import { create } from 'zustand';

export const useStore = create((set) => ({
  open: false,
  edit: false,
  setOpen: (open) => set({ open }),
  setEdit: (edit) => set({ edit }),
}));