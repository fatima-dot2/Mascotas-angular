
import { Injectable } from '@angular/core';
import { supabase } from './supabase';

export interface PetFirestore {
  id?: string;
  user_id?: string;
  name: string;
  type: 'Perro' | 'Gato' | 'Otro';
  breed: string;
  age: number;
  description: string;
  photoUrl?: string;
  sex?: 'Macho' | 'Hembra' | 'No identificado';
  birthDate?: string;
  weight?: number | null;
  color?: string;
  personality?: string;
  observations?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PetFirestoreService {

  async getPets(): Promise<PetFirestore[]> {
    const { data: { user }, error: authError } =
      await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('Debes iniciar sesión.');
    }

    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data ?? []).map(pet => ({
      ...pet,
      birthDate: pet.birth_date ?? ''
    })) as PetFirestore[];
  }

  async addPet(pet: PetFirestore): Promise<void> {
    const { data: { user }, error: authError } =
      await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('Debes iniciar sesión.');
    }

    const { id, user_id, photoUrl, birthDate, ...petData } = pet;

    const { error } = await supabase
      .from('pets')
      .insert({
        ...petData,
        user_id: user.id,
        birth_date: pet.birthDate || null
      });

    if (error) throw error;
  }

  async updatePet(
    id: string,
    pet: Partial<PetFirestore>
  ): Promise<void> {
    const { birthDate, photoUrl, user_id, ...petData } = pet;

    const { error } = await supabase
      .from('pets')
      .update({
        ...petData,
        ...(birthDate !== undefined
          ? { birth_date: birthDate || null }
          : {})
      })
      .eq('id', id);

    if (error) throw error;
  }

  async deletePet(id: string): Promise<void> {
    const { error } = await supabase
      .from('pets')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
