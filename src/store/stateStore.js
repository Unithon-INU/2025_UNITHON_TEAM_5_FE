import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useHospitalTypeStore = create(
  devtools(
    (set) => ({
      hospitalType: 'ER', // 초기값: 'emergency' 또는 'clinic'
      setHospitalType: (type) => set({ hospitalType: type }),
    }),
    { name: 'HospitalTypeStore' } // Redux DevTools에 표시될 이름
  )
);

export default useHospitalTypeStore;
