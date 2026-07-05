import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type HatId = 'none' | 'cap' | 'party' | 'beanie';
export type ShirtColorId = 'default' | 'red' | 'blue' | 'green' | 'purple';
export type PantsColorId = 'default' | 'black' | 'tan' | 'navy';

type CharacterState = {
  name: string;
  hat: HatId;
  shirtColor: ShirtColorId;
  pantsColor: PantsColorId;
  hasSetName: boolean;
  setName: (name: string) => void;
  setHat: (hat: HatId) => void;
  setShirtColor: (color: ShirtColorId) => void;
  setPantsColor: (color: PantsColorId) => void;
};

export const useCharacterStore = create<CharacterState>()(
  persist(
    (set) => ({
      name: '',
      hat: 'none',
      shirtColor: 'default',
      pantsColor: 'default',
      hasSetName: false,
      setName: (name) => set({ name: name.trim().slice(0, 20), hasSetName: true }),
      setHat: (hat) => set({ hat }),
      setShirtColor: (shirtColor) => set({ shirtColor }),
      setPantsColor: (pantsColor) => set({ pantsColor }),
    }),
    { name: 'portfolio-character' },
  ),
);
