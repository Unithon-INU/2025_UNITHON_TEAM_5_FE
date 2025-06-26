// src/store/useLocationStore.js
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useLocationStore = create(
  devtools(
    (set) => ({
      userLocation: null,
      initialUserLocation: null, // ✅ 최초 유저 위치 저장용
      setUserLocation: (lat, lon) =>
        set({ userLocation: { lat, lon } }),
      setInitialUserLocation: (lat, lon) =>
        set((state) =>
          state.initialUserLocation
            ? {} // 이미 있으면 안 바꿈
            : { initialUserLocation: { lat, lon } }
        ),
    }),
    { name: 'LocationStore' }
  )
);

export default useLocationStore;
