import { TasbeehItem } from '@/types/tasbeeh';

const STORAGE_KEY = 'ibadat_tasbeeh_folders_v1';

export const getStoredTasbeehs = (): TasbeehItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed: unknown = JSON.parse(data);
      if (!Array.isArray(parsed)) return [];

      const items = parsed.flatMap((value): TasbeehItem[] => {
        if (!value || typeof value !== 'object') return [];
        const item = value as Record<string, unknown>;
        if (
          typeof item.id !== 'string' || !item.id ||
          typeof item.title !== 'string' || !item.title.trim() ||
          typeof item.count !== 'number' || !Number.isSafeInteger(item.count) || item.count < 0
        ) return [];

        const goal = typeof item.goal === 'number' && Number.isSafeInteger(item.goal) && item.goal > 0 ? item.goal : 100;
        const createdAt = typeof item.createdAt === 'string' && !Number.isNaN(Date.parse(item.createdAt))
          ? item.createdAt
          : new Date(0).toISOString();
        return [{ id: item.id, title: item.title, count: item.count, goal, createdAt }];
      });

      // Migrate the original bundled starter set to Astaghfirullah with a 1000 count goal.
      const migrated = items
        .filter((item) => item.id !== '2' && item.id !== '3')
        .map((item) => item.id === '1' && item.title !== 'Astaghfirullah'
          ? { ...item, title: 'Astaghfirullah', goal: 1000 }
          : item);
      if (items.length === 0 || (migrated.length === 0 && items.every((item) => ['1', '2', '3'].includes(item.id)))) {
        migrated.push({ id: '1', title: 'Astaghfirullah', count: 0, goal: 1000, createdAt: new Date().toISOString() });
      }
      if (migrated.length !== items.length || migrated.some((item, index) => item !== items[index])) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      }
      return migrated;
    }

    const defaultItems: TasbeehItem[] = [
      { id: '1', title: 'Astaghfirullah', count: 0, goal: 1000, createdAt: new Date().toISOString() },
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
    console.error('Failed to save tasbeehs from localStorage', error);
  }
};
