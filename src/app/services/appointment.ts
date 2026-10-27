
import { Injectable } from '@angular/core';

export type AppointmentPetType = 'perro' | 'gato' | 'otro';
export type AppointmentStatus = 'Pendiente' | 'Completada';

export interface Appointment {
  id: number;
  petName: string;
  petType: AppointmentPetType;
  date: string;
  time: string;
  reason: string;
  veterinarian: string;
  status?: AppointmentStatus;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private readonly storageKey = 'petcare-appointments';

  getAppointments(): Appointment[] {
    try {
      const saved = localStorage.getItem(this.storageKey);

      if (!saved) {
        return [];
      }

      const appointments: Appointment[] = JSON.parse(saved);

      return Array.isArray(appointments) ? appointments : [];
    } catch {
      return [];
    }
  }

  addAppointment(
    appointment: Omit<Appointment, 'id'>
  ): void {
    const appointments = this.getAppointments();

    appointments.push({
      ...appointment,
      id: Date.now(),
      status: appointment.status ?? 'Pendiente'
    });

    this.saveAppointments(appointments);
  }

  markCompleted(id: number): void {
    const appointments = this.getAppointments().map(appointment =>
      appointment.id === id
        ? { ...appointment, status: 'Completada' as const }
        : appointment
    );

    this.saveAppointments(appointments);
  }

  deleteAppointment(id: number): void {
    const appointments = this.getAppointments()
      .filter(appointment => appointment.id !== id);

    this.saveAppointments(appointments);
  }

  private saveAppointments(appointments: Appointment[]): void {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(appointments)
    );
  }
}
