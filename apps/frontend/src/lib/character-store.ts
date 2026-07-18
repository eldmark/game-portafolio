import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CharacterState = {
  name: string;
  hasSetName: boolean;
  setName: (name: string) => void;
};

export const useCharacterStore = create<CharacterState>()(
  persist(
    (set) => ({
      name: '',
      hasSetName: false,
      setName: (name) => set({ name: name.trim().slice(0, 20), hasSetName: true }),
    }),
    { name: 'portfolio-character' },
  ),
);
