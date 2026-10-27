
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CareTip {
  title: string;
  description: string;
  pet: 'perro' | 'gato' | 'ambos';
  icon: string;
  category: string;
}

@Component({
  selector: 'app-care',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './care.css',
  templateUrl: './care.html'
})
export class Care {

  selectedPet: 'todos' | 'perro' | 'gato' = 'todos';

  tips: CareTip[] = [
    {
      title: 'Alimentación adecuada',
      description: 'Ofrece alimento adecuado para la especie, edad y necesidades de tu mascota. Consulta al veterinario si necesitas ajustar su dieta.',
      pet: 'ambos',
      icon: '🥣',
      category: 'Alimentación'
    },
    {
      title: 'Agua fresca todos los días',
      description: 'Mantén un recipiente limpio con agua fresca y accesible. Cámbiala con regularidad.',
      pet: 'ambos',
      icon: '💧',
      category: 'Alimentación'
    },
    {
      title: 'Paseos y actividad física',
      description: 'Los perros necesitan paseos y actividades apropiadas para su edad, salud y nivel de energía.',
      pet: 'perro',
      icon: '🐕',
      category: 'Ejercicio'
    },
    {
      title: 'Juego y enriquecimiento',
      description: 'Ofrece juguetes seguros, rascadores y lugares donde explorar. Las sesiones de juego ayudan a mantener a tu gato activo.',
      pet: 'gato',
      icon: '🧶',
      category: 'Ejercicio'
    },
    {
      title: 'Cepillado y pelaje',
      description: 'Cepilla a tu mascota según su tipo de pelo. Hazlo con suavidad y revisa si hay nudos o cambios en la piel.',
      pet: 'ambos',
      icon: '🪮',
      category: 'Higiene'
    },
    {
      title: 'Limpieza de su espacio',
      description: 'Lava sus recipientes y mantén limpia su cama. Para los gatos, limpia la caja de arena con frecuencia.',
      pet: 'ambos',
      icon: '🧼',
      category: 'Higiene'
    },
    {
      title: 'Revisiones veterinarias',
      description: 'Mantén al día las vacunas, la desparasitación y las revisiones recomendadas por un profesional veterinario.',
      pet: 'ambos',
      icon: '🩺',
      category: 'Salud'
    },
    {
      title: 'Identificación y seguridad',
      description: 'Usa una placa identificativa y procura que tu mascota tenga un entorno seguro. Evita dejarla sola en lugares peligrosos.',
      pet: 'ambos',
      icon: '🐾',
      category: 'Seguridad'
    },
    {
      title: 'Respeta su espacio',
      description: 'Permite que tu gato tenga lugares tranquilos para descansar y esconderse cuando lo necesite.',
      pet: 'gato',
      icon: '🏡',
      category: 'Bienestar'
    }
  ];

  get filteredTips(): CareTip[] {
    if (this.selectedPet === 'todos') {
      return this.tips;
    }

    return this.tips.filter(tip =>
      tip.pet === this.selectedPet || tip.pet === 'ambos'
    );
  }

  selectPet(pet: 'todos' | 'perro' | 'gato'): void {
    this.selectedPet = pet;
  }
}
