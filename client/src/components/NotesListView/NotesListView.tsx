import "./NotesListView.css";
import { NoteView } from "../NoteView";
import { FC } from "react";
import { NoteList } from "../../api/Note";

export interface NoteListViewProps {
  noteList: NoteList;
}

export const NotesListView: FC<NoteListViewProps> = ({ noteList }) => {
  return (
    <ul className="note-list-view">
      {noteList.map((note) => (
        <li key={note.id}>
          <NoteView note={note} />
        </li>
      ))}
    </ul>
  );
};
