
import { Injectable } from '@angular/core';

export interface Appointment {
  id: number;
  petName: string;
  petType: 'perro' | 'gato' | 'otro';
  date: string;
  time: string;
  reason: string;
  veterinarian: string;
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

      if (!Array.isArray(appointments)) {
        return [];
      }

      return appointments;
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
      id: Date.now()
    });

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
