import { z } from 'zod';
import { validResp } from './validResp';
import { queryClient } from './QueryClient';
import { API_BASE_URL } from '../config';

export const UserAuthSchema = z.object({
    username: z.string().min(5, 'Имя пользователя не может быть менее 5 символов'),
    email: z.string().email(),
    password: z.string().min(8, 'Пароль не может быть менее 8 символов'),
});

export const UserSchema = z.object({
    id: z.string(),
    username: z.string().min(5, 'Имя пользователя не может быть менее 5 символов'),
    email: z.string().email(),
    password: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;

export function loginUser(email: string, password: string): Promise<void> {
    return fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }, 
        credentials: 'include',
        body: JSON.stringify({ email, password })
    })
    .then(validResp)
    .then(() => undefined)
}

export function registerUser(username: string, email: string, password: string): Promise<void> {
    return fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }, 
        credentials: 'include', 
        body: JSON.stringify({ username, email, password })
    })
    .then(validResp)
    .then(() => undefined)
}

export function logoutUser(): Promise<void> {
    return fetch(`${API_BASE_URL}/api/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(() => {
        window.location.href = '/';
    })
}

export function fetchMe(): Promise<User> {
    return fetch(`${API_BASE_URL}/api/users/me`, {
        credentials: 'include'
    })
    .then(validResp)
    .then(response => response.json())
    .then(data => {
        const { password, ...userData } = data;
        void password;
        return UserSchema.parse(userData);
    })
}