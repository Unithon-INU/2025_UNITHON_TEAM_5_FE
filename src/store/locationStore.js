import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useLocationStore = create(
  devtools(
    (set) => ({
      userLocation: null,
      setUserLocation: (lat, lon) => set({ userLocation: { lat, lon } }),
    }),
    { name: 'LocationStore' } // Devtools에서 보일 이름
  )
);

export default useLocationStore;
