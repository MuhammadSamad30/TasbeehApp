import { TasbeehItem } from '@/types/tasbeeh';

const STORAGE_KEY = 'ibadat_tasbeeh_folders_v1';

export const getStoredTasbeehs = (): TasbeehItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const items: TasbeehItem[] = JSON.parse(data);
      return items.map((item) => ({ ...item, goal: item.goal ?? 100 }));
    }
    // Default initial items if storage is empty
    const defaultItems: TasbeehItem[] = [
      { id: '1', title: 'Astaghfar (أستغفر الله)', count: 0, createdAt: new Date().toISOString() },
      { id: '2', title: 'Kalima Tayyibah', count: 0, createdAt: new Date().toISOString() },
      { id: '3', title: 'SubhanAllah', count: 0, createdAt: new Date().toISOString() }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultItems));
    return defaultItems;
  } catch (error) {
    console.error('Failed to load tasbeehs from localStorage', error);
    return [];
  }
};

export const saveStoredTasbeehs = (items: TasbeehItem[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save tasbeehs to localStorage', error);
  }
};
