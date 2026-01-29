import { useNoteList } from "../../api/Note"
import { Loader } from "../Loader"
import { NotesListView } from "./NotesListView"

export const FetchNotesListView = () => {
    const { state, refetch } = useNoteList();

    switch(state.status) {
        case 'pending':
            return <Loader />
        case 'success':
            return <NotesListView noteList={state.data} />
        case 'error':
            return <div>
                <span>Не удалось загрузить данные</span>
                <button onClick={() => refetch()}>Повторить попытку</button>
            </div>
        default:
            return null;
    }
}