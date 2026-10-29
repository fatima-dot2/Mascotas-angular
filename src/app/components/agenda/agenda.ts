
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  ReminderService,
  VaccineReminder
} from '../../services/reminder';

import {
  Appointment,
  AppointmentService
} from '../../services/appointment';

import {
  HealthEventType,
  HealthRecordService
} from '../../services/health-record';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agenda.html',
  styleUrl: './agenda.css'
})
export class Agenda {
  // =========================
  // CITAS VETERINARIAS
  // =========================

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

  // =========================
  // RECORDATORIOS DE VACUNAS
  // =========================

  vaccineReminders: VaccineReminder[] = [];

  vaccinePetName = '';
  vaccinePetType: 'perro' | 'gato' | 'otro' = 'perro';
  vaccineName = '';
  vaccineDate = '';
  vaccineVeterinarian = '';
  vaccineNotes = '';

  reminderMessage = '';
  reminderError = '';

  // =========================
  // CONSTRUCTOR
  // =========================

  constructor(
    private appointmentService: AppointmentService,
    private healthRecordService: HealthRecordService,
    private reminderService: ReminderService
  ) {
    this.loadAppointments();
    this.loadVaccineReminders();
  }

  // =========================
  // FECHAS
  // =========================

  private getToday(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  // =========================
  // GESTIÓN DE CITAS
  // =========================

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
      veterinarian: this.veterinarian.trim(),
      status: 'Pendiente'
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
    if (appointment.status === 'Completada') {
      return 'Completada';
    }

    const appointmentDate = new Date(
      `${appointment.date}T${appointment.time}`
    );

    return appointmentDate.getTime() < Date.now()
      ? 'Finalizada'
      : 'Pendiente';
  }

  markCompleted(appointment: Appointment): void {
    this.error = '';
    this.success = '';

    if (appointment.status === 'Completada') {
      this.error = 'Esta cita ya está marcada como completada.';
      return;
    }

    const appointmentDate = new Date(
      `${appointment.date}T${appointment.time}`
    );

    if (appointmentDate.getTime() > Date.now()) {
      this.error =
        'Solo puedes completar una cita cuando ya haya ocurrido.';
      return;
    }

    const confirmed = confirm(
      `¿Confirmas que la cita de ${appointment.petName} ya se realizó?`
    );

    if (!confirmed) {
      return;
    }

    this.appointmentService.markCompleted(appointment.id);
    this.loadAppointments();

    this.success =
      'Cita marcada como completada. Ahora puedes crear su registro de salud.';
  }

  // =========================
  // HISTORIAL DE SALUD
  // =========================

  hasHealthRecord(appointmentId: number): boolean {
    return this.healthRecordService
      .hasRecordForAppointment(appointmentId);
  }

  createHealthRecord(appointment: Appointment): void {
    this.error = '';
    this.success = '';

    if (appointment.status !== 'Completada') {
      this.error = 'Primero marca la cita como completada.';
      return;
    }

    if (this.hasHealthRecord(appointment.id)) {
      this.error =
        'Esta cita ya tiene un registro en el historial de salud.';
      return;
    }

    const eventTypes: HealthEventType[] = [
      'Vacuna',
      'Desparasitación',
      'Consulta veterinaria',
      'Medicamento indicado',
      'Alergia',
      'Otro'
    ];

    const choices = eventTypes
      .map((type, index) => `${index + 1}. ${type}`)
      .join('\n');

    const selected = prompt(
      `Selecciona el tipo de registro escribiendo su número:\n\n${choices}`,
      '3'
    );

    if (selected === null) {
      return;
    }

    const index = Number(selected) - 1;

    if (
      !Number.isInteger(index) ||
      index < 0 ||
      index >= eventTypes.length
    ) {
      this.error = 'Selecciona un número válido del 1 al 6.';
      return;
    }

    const details = prompt(
      'Escribe las observaciones reales de la consulta:',
      `Motivo de la cita: ${appointment.reason}`
    );

    if (details === null) {
      return;
    }

    if (!details.trim()) {
      this.error = 'Las observaciones no pueden estar vacías.';
      return;
    }

    this.healthRecordService.addRecord({
      petName: appointment.petName,
      petType: appointment.petType,
      date: appointment.date,
      eventType: eventTypes[index],
      veterinarian: appointment.veterinarian,
      details: details.trim(),
      appointmentId: appointment.id
    });

    this.success =
      'Registro creado. Ya puedes consultarlo en el Historial de Salud.';
  }

  // =========================
  // GESTIÓN DE RECORDATORIOS
  // =========================

  loadVaccineReminders(): void {
    this.vaccineReminders = this.reminderService
      .getReminders()
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  addVaccineReminder(): void {
    this.reminderMessage = '';
    this.reminderError = '';

    if (
      !this.vaccinePetName.trim() ||
      !this.vaccineName.trim() ||
      !this.vaccineDate
    ) {
      this.reminderError =
        'Completa el nombre de la mascota, la vacuna y la fecha.';
      return;
    }

    if (this.vaccineDate < this.getToday()) {
      this.reminderError =
        'La fecha del recordatorio debe ser hoy o posterior.';
      return;
    }

    this.reminderService.addReminder({
      petName: this.vaccinePetName.trim(),
      petType: this.vaccinePetType,
      vaccine: this.vaccineName.trim(),
      date: this.vaccineDate,
      veterinarian: this.vaccineVeterinarian.trim(),
      notes: this.vaccineNotes.trim()
    });

    this.loadVaccineReminders();

    this.vaccinePetName = '';
    this.vaccinePetType = 'perro';
    this.vaccineName = '';
    this.vaccineDate = '';
    this.vaccineVeterinarian = '';
    this.vaccineNotes = '';

    this.reminderMessage =
      'Recordatorio de vacuna guardado correctamente.';
  }

  deleteVaccineReminder(id: number): void {
    const confirmed = confirm(
      '¿Seguro que deseas eliminar este recordatorio de vacuna?'
    );

    if (!confirmed) {
      return;
    }

    this.reminderService.deleteReminder(id);
    this.loadVaccineReminders();

    this.reminderMessage = 'Recordatorio eliminado.';
    this.reminderError = '';
  }

  getReminderStatus(date: string): string {
    const today = this.getToday();

    if (date < today) {
      return 'Vencido';
    }

    if (date === today) {
      return 'Hoy';
    }

    return 'Próximo';
  }
}
