
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { User } from '@supabase/supabase-js';

import { AuthService } from '../../services/auth';
import {
  PetFirestoreService,
  PetFirestore
} from '../../services/pet-firebase';

@Component({
  selector: 'app-my-pet',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './my-pet.html',
  styleUrl: './my-pet.css'
})
export class MyPets implements OnInit, OnDestroy {
  pets: PetFirestore[] = [];

  name = '';
  type: 'Perro' | 'Gato' | 'Otro' = 'Perro';
  breed = '';
  age: number | null = null;
  description = '';
  sex: 'Macho' | 'Hembra' | 'No identificado' = 'No identificado';
  birthDate = '';
  weight: number | null = null;
  color = '';
  personality = '';
  observations = '';

  usuario: User | null = null;

  loading = true;
  saving = false;
  error = '';
  success = '';
  authReady = false;

  private unsubscribeAuth?: () => void;

  constructor(
    private petService: PetFirestoreService,
    private authService: AuthService
  ) {}

  

ngOnInit(): void {
  this.loading = true;
  this.authReady = false;

  this.unsubscribeAuth = this.authService.listenAuth(user => {
    console.log('1. Usuario recibido:', user?.email ?? 'Sin usuario');

    this.usuario = user;
    this.authReady = true;

    if (user) {
      console.log('2. Iniciando carga de mascotas');
      this.loadPets();
    } else {
      this.pets = [];
      this.loading = false;
      console.log('3. No hay sesión');
    }
  });
}



  ngOnDestroy(): void {
    this.unsubscribeAuth?.();
  }



async loadPets(): Promise<void> {
  this.loading = true;
  this.error = '';

  try {
    console.log('4. Consultando Supabase...');
    this.pets = await this.petService.getPets();
    console.log('5. Mascotas recibidas:', this.pets);
  } catch (error) {
    console.error('6. Error al cargar mascotas:', error);
    this.error = 'No se pudieron cargar tus mascotas.';
  } finally {
    this.loading = false;
    console.log('7. Carga finalizada');
  }
}




async addPet(): Promise<void> {
  this.error = '';
  this.success = '';

  if (!this.usuario) {
    this.error = 'Debes iniciar sesión.';
    return;
  }

  if (!this.name.trim() || !this.breed.trim()) {
    this.error = 'Completa el nombre y la raza.';
    return;
  }

  this.saving = true;

  try {
    console.log('1. Preparando mascota...');

    await this.petService.addPet({
      name: this.name.trim(),
      type: this.type,
      breed: this.breed.trim(),
      age: Number(this.age),
      description: this.description.trim(),
      sex: this.sex,
      birthDate: this.birthDate || '',
      weight: this.weight,
      color: this.color,
      personality: this.personality,
      observations: this.observations
    });

    console.log('2. Mascota guardada');

    this.success = '¡Mascota registrada correctamente!';

    await this.loadPets();

    this.name = '';
    this.type = 'Perro';
    this.breed = '';
    this.age = null;
    this.description = '';
    this.sex = 'No identificado';
    this.birthDate = '';
    this.weight = null;
    this.color = '';
    this.personality = '';
    this.observations = '';

  } catch (error) {
    console.error('Error al guardar mascota:', error);
    this.error = 'No se pudo guardar la mascota.';
  } finally {
    this.saving = false;
    console.log('3. Guardado finalizado');
  }
}


  async deletePet(pet: PetFirestore): Promise<void> {
    if (!pet.id) return;

    const confirmed = confirm(
      `¿Seguro que deseas eliminar a ${pet.name}?`
    );

    if (!confirmed) return;

    this.error = '';
    this.success = '';

    try {
      await this.petService.deletePet(pet.id);
      await this.loadPets();
      this.success = 'Mascota eliminada correctamente.';
    } catch (error) {
      console.error('Error al eliminar mascota:', error);
      this.error = 'No se pudo eliminar la mascota.';
    }
  }
}
