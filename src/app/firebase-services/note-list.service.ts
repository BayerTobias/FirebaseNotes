import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  collectionData,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
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

  notes: Note[] = [];
  trashNotes: Note[] = [];

  unsubNotes;
  unsubTrash;

  constructor() {
    this.unsubNotes = this.subNotes();
    this.unsubTrash = this.subTrash();

    // this.items$ = collectionData(this.getNotesRef());
    // this.items = this.items$.subscribe((list: any) => {
    //   console.log(list);
    // });
  }

  ngonDestroy() {
    // this.items.unsubscribe();
    this.unsubNotes();
    this.unsubTrash();
  }

  async deleteNote(colId: string, docId: string) {
    await deleteDoc(this.getSingleDocRef(colId, docId))
      .catch((err) => {
        console.error(err);
      })
      .then(() => {
        console.log('Note deleted');
      });
  }

  async updateNote(note: Note) {
    if (note.id) {
      const colID = this.getColIdFromNote(note);
      await updateDoc(
        this.getSingleDocRef(colID, note.id),
        this.getCleanJson(note)
      ).catch((err) => console.error(err));
    }
  }

  getColIdFromNote(note: Note) {
    if (note.type === 'note') return 'notes';
    else return 'trash';
  }

  getCleanJson(note: Note) {
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked,
    };
  }

  async addNote(item: {}) {
    await addDoc(this.getNotesRef(), item)
      .catch((err) => {
        console.error(err);
      })
      .then((docRef) => {
        console.log('Document written with ID', docRef);
      });
  }

  subNotes() {
    return onSnapshot(this.getNotesRef(), (notes) => {
      this.notes = [];
      notes.forEach((note) => {
        this.notes.push(this.setNoteObject(note.data(), note.id));
        console.log(this.notes);
      });
    });
  }

  subTrash() {
    return onSnapshot(this.getTrashRef(), (trashNotes) => {
      this.trashNotes = [];
      trashNotes.forEach((note) => {
        this.trashNotes.push(this.setNoteObject(note.data(), note.id));
        console.log('Trash', this.trashNotes);
      });
    });
  }

  setNoteObject(obj: any, id: string): Note {
    return {
      id: id,
      type: obj.type || 'note',
      title: obj.title || '',
      content: obj.content || '',
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
