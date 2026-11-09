
import { Injectable } from '@angular/core';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query
} from 'firebase/firestore';
import { db } from './firebase';
import { auth } from './firebase';

export interface PetFirestore {
  id?: string;
  name: string;
  type: 'Perro' | 'Gato' | 'Otro';
  breed: string;
  age: number;
  description: string;
  sexo?: "Macho" | "Hembra" | "Desconocido";
  birthdate?: string;
  weight?: number | null;
  color?: string
  personality?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PetFirestoreService {

  private getUserId(): string {
    const user = auth.currentUser;

    if (!user) {
      throw new Error('Debes iniciar sesión para administrar mascotas.');
    }

    return user.uid;
  }

  private getPetsCollection() {
    const uid = this.getUserId();
    return collection(db, 'users', uid, 'pets');
  }

  async getPets(): Promise<PetFirestore[]> {
    const petsRef = this.getPetsCollection();
    const snapshot = await getDocs(query(petsRef));

    return snapshot.docs.map(document => ({
      id: document.id,
      ...document.data()
    } as PetFirestore));
  }

  async addPet(pet: PetFirestore): Promise<void> {
    const petsRef = this.getPetsCollection();

    const { id, ...petData } = pet;

    await addDoc(petsRef, {
      ...petData,
      createdAt: new Date()
    });
  }

  async updatePet(id: string, pet: Partial<PetFirestore>): Promise<void> {
    const uid = this.getUserId();
    const petRef = doc(db, 'users', uid, 'pets', id);

    await updateDoc(petRef, pet);
  }

  async deletePet(id: string): Promise<void> {
    const uid = this.getUserId();
    const petRef = doc(db, 'users', uid, 'pets', id);

    await deleteDoc(petRef);
  }
}
