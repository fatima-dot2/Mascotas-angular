
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';

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

  sex: 'Macho' | 'Hembra' | 'No identificado' =
    'No identificado';

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
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.loading = true;
    this.authReady = false;

    this.unsubscribeAuth = this.authService.listenAuth(user => {

      // Evitar recargar si el usuario no ha cambiado
      if (
        this.authReady &&
        this.usuario?.id === user?.id
      ) {
        return;
      }

      this.usuario = user;
      this.authReady = true;

      if (user) {
        this.loadPets();
      } else {
        this.pets = [];
        this.loading = false;
        this.cdr.detectChanges();
      }

    });
  }

  ngOnDestroy(): void {
    this.unsubscribeAuth?.();
  }

  async loadPets(): Promise<void> {

    this.loading = true;
    this.error = '';

    this.cdr.detectChanges();

    try {

      console.log('Consultando mascotas...');

      this.pets = await this.petService.getPets();

      console.log('Mascotas recibidas:', this.pets);

    } catch (error) {

      console.error('Error al cargar mascotas:', error);

      this.error = 'No se pudieron cargar tus mascotas.';

    } finally {

      this.loading = false;

      this.cdr.detectChanges();

      console.log('Carga finalizada:', this.loading);
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
      this.cdr.detectChanges();

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
