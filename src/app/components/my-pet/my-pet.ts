
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from 'firebase/auth';
import { AuthService } from '../../services/auth';
import { RouterLink } from '@angular/router';
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

  this.unsubscribeAuth = this.authService.listenAuth(async user => {
    this.usuario = user;
    this.authReady = true;

    if (!user) {
      this.pets = [];
      this.loading = false;
      return;
    }

    await this.loadPets();
  });
}


  ngOnDestroy(): void {
    this.unsubscribeAuth?.();
  }

  async loadPets(): Promise<void> {
    this.loading = true;
    this.error = '';

    try {
      this.pets = await this.petService.getPets();
    } catch {
      this.error = 'No se pudieron cargar las mascotas.';
    } finally {
      this.loading = false;
    }
  }

  async addPet(): Promise<void> {
    this.error = '';
    this.success = '';

    if (!this.usuario) {
      this.error = 'Inicia sesión para registrar una mascota.';
      return;
    }

    if (!this.name.trim() || !this.breed.trim() || this.age === null) {
      this.error = 'Completa el nombre, raza y edad.';
      return;
    }

    if (!Number.isInteger(this.age) || this.age < 0 || this.age > 100) {
      this.error = 'La edad debe ser un número entre 0 y 100.';
      return;
    }

    this.saving = true;

    try {
      await this.petService.addPet({
        name: this.name.trim(),
        type: this.type,
        breed: this.breed.trim(),
        age: this.age,
        description: this.description.trim()
      });

      this.name = '';
      this.type = 'Perro';
      this.breed = '';
      this.age = null;
      this.description = '';

      await this.loadPets();
      this.success = '¡Mascota registrada correctamente!';
    } catch {
      this.error = 'No se pudo guardar la mascota. Intenta nuevamente.';
    } finally {
      this.saving = false;
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
    } catch {
      this.error = 'No se pudo eliminar la mascota.';
    }
  }
}
