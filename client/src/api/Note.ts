import { z } from 'zod';
import { validResp } from './validResp';
import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '../config';

export const NoteSchema = z.object({
    id: z.string(),
    title: z.string(),
    text: z.string(),
    userId: z.string(),
    createdAt: z.number(),
});

export type Note = z.infer<typeof NoteSchema>;

export const NoteList = z.array(NoteSchema);

export type NoteList = z.infer<typeof NoteList>;

export const FetchNoteListSchema = z.object({
    list: NoteList,
})

export type FetchNoteListResponse = z.infer<typeof FetchNoteListSchema>;

export function fetchNoteList(): Promise<FetchNoteListResponse> {
    return fetch(`${API_BASE_URL}/api/notes`, {
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => FetchNoteListSchema.parse(data))
    .catch(error => {
        console.error('Ошибка при получении списка заметок:', error);
        throw error;
    });
}

export function createNote(title: string, text: string): Promise<Response> {
    return fetch(`${API_BASE_URL}/api/notes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }, 
        body: JSON.stringify({ title, text }),
        credentials: 'include'
    })
    .then(validResp)
    .catch(error => {
        console.error('Ошибка при создании заметки:', error);
        throw error;
    });
}

interface IdleRequestState {
    status: 'idle';
}

interface LoadingRequestState {
    status: 'pending';
}

interface SuccessRequestState {
    status: 'success';
    data: NoteList;
}

interface ErrorRequestState {
    status: 'error';
    error: unknown;
}

type RequestState = 
| IdleRequestState 
| LoadingRequestState 
| SuccessRequestState 
| ErrorRequestState;

export function useNoteList() {
    const { data, status, error, refetch } = useQuery({
        queryFn: fetchNoteList,
        queryKey: ['notes'],
    });

    let state: RequestState;
    switch(status) {
        case 'pending':
            state = { status: 'pending' };
            break;
        case 'success':
            state = { status: 'success', data: data?.list || []};
            break;
        case 'error':
            state = { status: 'error', error};
            break;
        default:
            state = { status: 'idle' };
    }

    return { state, refetch }
}