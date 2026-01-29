import { useQuery } from "@tanstack/react-query"
import { queryClient } from "../api/QueryClient"
import { fetchMe } from "../api/User"
import { AuthForm } from "../components/AuthForm"
import { Loader } from "../components/Loader"
import { NoteForm } from "../components/NoteForm"
import { FetchNotesListView } from "../components/NotesListView/FetchNotesListView"


export const Account = () => {
    const meQuery = useQuery({
        queryFn: () => fetchMe(),
        queryKey: ['users', 'me'],
        retry: false,
    }, queryClient)

    switch(meQuery.status) {
        case 'pending':
            return <Loader />
        case 'error':
            return <AuthForm />
        case 'success':
            return (
                <div className="notes-app">
                    <NoteForm />
                    <FetchNotesListView />
                </div>
            )
    }
}