
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Pregunta {
  pregunta: string;
  opciones: string[];
  correcta: number;
  explicacion: string;
}

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css'
})
export class Quiz {

  preguntas: Pregunta[] = [
    {
      pregunta: '¿Qué necesita una mascota para mantenerse saludable?',
      opciones: [
        'Solo comida',
        'Agua, alimentación, ejercicio y atención veterinaria',
        'Solo dormir'
      ],
      correcta: 1,
      explicacion: 'Las mascotas necesitan cuidados integrales para mantenerse saludables.'
    },
    {
      pregunta: '¿Qué debes hacer si tu mascota presenta síntomas de enfermedad?',
      opciones: [
        'Ignorarlos',
        'Darle cualquier medicamento',
        'Consultar a un veterinario'
      ],
      correcta: 2,
      explicacion: 'Un veterinario puede evaluar a tu mascota y recomendar el tratamiento adecuado.'
    },
    {
      pregunta: '¿Por qué es importante vacunar a las mascotas?',
      opciones: [
        'Para prevenir enfermedades',
        'Para cambiar su color',
        'Para que duerman más'
      ],
      correcta: 0,
      explicacion: 'Las vacunas ayudan a prevenir enfermedades importantes.'
    },
    {
      pregunta: '¿Qué debes hacer para evitar que tu perro se pierda?',
      opciones: [
        'Dejarlo salir solo',
        'Usar identificación y supervisarlo',
        'No ponerle collar'
      ],
      correcta: 1,
      explicacion: 'La identificación y supervisión ayudan a mantenerlo seguro.'
    },
    {
      pregunta: '¿Cómo debe ser la alimentación de un gato?',
      opciones: [
        'Solo leche',
        'Cualquier alimento humano',
        'Alimento adecuado para gatos y agua limpia'
      ],
      correcta: 2,
      explicacion: 'Los gatos necesitan una alimentación apropiada para su especie.'
    },
    {
      pregunta: '¿Qué significa la tenencia responsable?',
      opciones: [
        'Cuidar, proteger y respetar las necesidades de la mascota',
        'Tener muchas mascotas',
        'Dejar que se cuide sola'
      ],
      correcta: 0,
      explicacion: 'La tenencia responsable implica compromiso durante toda la vida del animal.'
    },
    {
      pregunta: '¿Qué debes hacer con los desechos de tu perro durante un paseo?',
      opciones: [
        'Dejarlos en la calle',
        'Recogerlos y depositarlos correctamente',
        'Cubrirlos con hojas'
      ],
      correcta: 1,
      explicacion: 'Recoger los desechos mantiene limpios los espacios públicos.'
    },
    {
      pregunta: '¿Qué necesita un gato para sentirse seguro?',
      opciones: [
        'Un ambiente tranquilo, refugio y cuidados',
        'Estar siempre afuera',
        'No tener agua'
      ],
      correcta: 0,
      explicacion: 'Los gatos necesitan un ambiente seguro y enriquecido.'
    },
    {
      pregunta: '¿Por qué es importante esterilizar a las mascotas?',
      opciones: [
        'Para que cambien de especie',
        'Para evitar que coman',
        'Para contribuir al control responsable de la reproducción'
      ],
      correcta: 2,
      explicacion: 'La esterilización, realizada por profesionales veterinarios, ayuda a prevenir camadas no planificadas.'
    },
    {
      pregunta: '¿Qué debes hacer antes de adoptar una mascota?',
      opciones: [
        'Considerar tiempo, espacio y recursos para cuidarla',
        'Adoptarla sin preparación',
        'Elegirla solo por su apariencia'
      ],
      correcta: 0,
      explicacion: 'Adoptar implica un compromiso de cuidado, tiempo y responsabilidad.'
    }
  ];

  indice = 0;
  puntuacion = 0;
  respuestaSeleccionada: number | null = null;
  respondida = false;
  terminado = false;

  seleccionarRespuesta(opcion: number): void {
    if (this.respondida) return;

    this.respuestaSeleccionada = opcion;
    this.respondida = true;

    if (opcion === this.preguntas[this.indice].correcta) {
      this.puntuacion++;
    }
  }

  siguiente(): void {
    if (!this.respondida) return;

    if (this.indice < this.preguntas.length - 1) {
      this.indice++;
      this.respuestaSeleccionada = null;
      this.respondida = false;
    } else {
      this.terminado = true;
    }
  }

  reiniciar(): void {
    this.indice = 0;
    this.puntuacion = 0;
    this.respuestaSeleccionada = null;
    this.respondida = false;
    this.terminado = false;
  }

  get porcentaje(): number {
    return ((this.indice + 1) / this.preguntas.length) * 100;
  }

  get mensajeResultado(): string {
    if (this.puntuacion >= 9) {
      return '¡Excelente! Tienes grandes conocimientos sobre el cuidado responsable.';
    }

    if (this.puntuacion >= 6) {
      return '¡Muy bien! Conoces bastante sobre el bienestar de las mascotas.';
    }

    return '¡Buen intento! Sigue aprendiendo sobre el cuidado responsable.';
  }
}
