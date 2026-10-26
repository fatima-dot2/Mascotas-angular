
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Appointment,
  AppointmentService
} from '../../services/appointment';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agenda.html',
  styleUrl: './agenda.css'
})
export class Agenda {
  appointments: Appointment[] = [];

  petName = '';
  petType: 'perro' | 'gato' | 'otro' = 'perro';
  date = '';
  time = '';
  reason = '';
  veterinarian = '';

  error = '';
  success = '';

  minDate = this.getToday();

  constructor(
    private appointmentService: AppointmentService
  ) {
    this.loadAppointments();
  }

  private getToday(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  loadAppointments(): void {
    this.appointments = this.appointmentService
      .getAppointments()
      .sort((a, b) => {
        const first = `${a.date}T${a.time}`;
        const second = `${b.date}T${b.time}`;

        return first.localeCompare(second);
      });
  }

  addAppointment(): void {
    this.error = '';
    this.success = '';

    if (
      !this.petName.trim() ||
      !this.date ||
      !this.time ||
      !this.reason.trim() ||
      !this.veterinarian.trim()
    ) {
      this.error = 'Completa todos los campos.';
      return;
    }

    if (this.date < this.minDate) {
      this.error = 'Selecciona una fecha de hoy en adelante.';
      return;
    }

    const selectedDate = new Date(`${this.date}T${this.time}`);
    const now = new Date();

    if (selectedDate.getTime() < now.getTime()) {
      this.error = 'Selecciona una hora futura.';
      return;
    }

    const duplicate = this.appointments.some(appointment =>
      appointment.date === this.date &&
      appointment.time === this.time &&
      appointment.veterinarian.trim().toLowerCase() ===
        this.veterinarian.trim().toLowerCase()
    );

    if (duplicate) {
      this.error =
        'Ya tienes una cita con ese veterinario en esa fecha y hora.';
      return;
    }

    this.appointmentService.addAppointment({
      petName: this.petName.trim(),
      petType: this.petType,
      date: this.date,
      time: this.time,
      reason: this.reason.trim(),
      veterinarian: this.veterinarian.trim()
    });

    this.loadAppointments();

    this.petName = '';
    this.petType = 'perro';
    this.date = '';
    this.time = '';
    this.reason = '';
    this.veterinarian = '';

    this.success = '¡La cita se registró correctamente!';
  }

  deleteAppointment(id: number): void {
    const confirmed = confirm(
      '¿Seguro que deseas eliminar esta cita?'
    );

    if (!confirmed) {
      return;
    }

    this.appointmentService.deleteAppointment(id);
    this.loadAppointments();

    this.success = 'La cita se eliminó correctamente.';
    this.error = '';
  }

  getStatus(appointment: Appointment): string {
    const appointmentDate = new Date(
      `${appointment.date}T${appointment.time}`
    );

    return appointmentDate.getTime() < Date.now()
      ? 'Finalizada'
      : 'Pendiente';
  }
}
