import { fetchUser, saveUser } from './repository';
import type { User } from './model';

export async function registerUser(userData: User): Promise<void> {
  // Регистрация
  await saveUser(userData);
}

export async function getUserData(userId: string): Promise<User> {
  // Получение данных юзера
  const user = await fetchUser(userId);
  return user;
}
