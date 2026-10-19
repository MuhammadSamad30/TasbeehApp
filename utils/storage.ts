import { TasbeehItem } from '@/types/tasbeeh';

const STORAGE_KEY = 'ibadat_tasbeeh_folders_v1';

export const getStoredTasbeehs = (): TasbeehItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed: unknown = JSON.parse(data);
      if (!Array.isArray(parsed)) return [];

      return parsed.flatMap((value): TasbeehItem[] => {
        if (!value || typeof value !== 'object') return [];

        const item = value as Record<string, unknown>;
        if (
          typeof item.id !== 'string' || !item.id ||
          typeof item.title !== 'string' || !item.title.trim() ||
          typeof item.count !== 'number' || !Number.isSafeInteger(item.count) || item.count < 0
        ) return [];

        const goal = typeof item.goal === 'number' && Number.isSafeInteger(item.goal) && item.goal > 0
          ? item.goal
          : 100;
        const createdAt = typeof item.createdAt === 'string' && !Number.isNaN(Date.parse(item.createdAt))
          ? item.createdAt
          : new Date(0).toISOString();

        return [{
          id: item.id,
          title: item.title,
          count: item.count,
          goal,
          createdAt,
        }];
      });
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
