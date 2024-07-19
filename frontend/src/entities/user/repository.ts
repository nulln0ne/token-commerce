import type { User } from './model';

export async function fetchUser(userId: number): Promise<User> {
  // Placeholder запрос к API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: userId, name: 'Name', wallet: '0xADDRESS' });
    }, 1000);
  });
}

export async function saveUser(user: User): Promise<void> {
  // Placeholder запрос для сохранения
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 1000);
  });
}
