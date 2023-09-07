import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  collectionData,
  onSnapshot,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Note } from '../interfaces/note.interface';

@Injectable({
  providedIn: 'root',
})
export class NoteListService {
  firestore: Firestore = inject(Firestore);

  // items$: any;
  // items: any;

  unsubNotes;

  notes: Note[] = [];
  trash: Note[] = [];

  constructor() {
    this.unsubNotes = onSnapshot(this.getNotesRef(), (list) => {
      list.forEach((element) => {
        const data = element.data();
        console.log(data['title']);
      });
    });

    // this.items$ = collectionData(this.getNotesRef());
    // this.items = this.items$.subscribe((list: any) => {
    //   console.log(list);});
  }

  ngonDestroy() {
    // this.items.unsubscribe();
    this.unsubNotes();
  }

  setNoteObject(obj: any, id: string): Note {
    return {
      id: id,
      type: obj.type || 'note',
      titel: obj.title || '',
      content: obj.description || '',
      marked: obj.marked || false,
    };
  }

  getNotesRef() {
    return collection(this.firestore, 'notes');
  }

  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }
}
