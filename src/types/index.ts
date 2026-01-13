export interface Category {
  id: string;
  name: string;
  icon: string;
  topic?: string;
}

export const categories: Category[] = [
  { id: 'fiction', name: 'FICTION', icon: '🧪', topic: 'fiction' },
  { id: 'drama', name: 'DRAMA', icon: '🎭', topic: 'drama' },
  { id: 'humor', name: 'HUMOR', icon: '😄', topic: 'humor' },
  { id: 'politics', name: 'POLITICS', icon: '👤', topic: 'politics' },
  { id: 'philosophy', name: 'PHILOSOPHY', icon: '☯️', topic: 'philosophy' },
  { id: 'history', name: 'HISTORY', icon: '📜', topic: 'history' },
  { id: 'adventure', name: 'ADVENTURE', icon: '🧗', topic: 'adventure' },
];
