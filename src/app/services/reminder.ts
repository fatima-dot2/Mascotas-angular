
import { Injectable } from '@angular/core';

export interface VaccineReminder {
  id: number;
  petName: string;
  petType: 'perro' | 'gato' | 'otro';
  vaccine: string;
  date: string;
  veterinarian: string;
  notes: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReminderService {
  private readonly storageKey = 'petcare-vaccine-reminders';

  getReminders(): VaccineReminder[] {
    try {
      const saved = localStorage.getItem(this.storageKey);

      if (!saved) {
        return [];
      }

      const reminders: VaccineReminder[] = JSON.parse(saved);

      return Array.isArray(reminders) ? reminders : [];
    } catch {
      return [];
    }
  }

  addReminder(
    reminder: Omit<VaccineReminder, 'id'>
  ): void {
    const reminders = this.getReminders();

    reminders.push({
      ...reminder,
      id: Date.now()
    });

    this.saveReminders(reminders);
  }

  deleteReminder(id: number): void {
    const reminders = this.getReminders().filter(
      reminder => reminder.id !== id
    );

    this.saveReminders(reminders);
  }

  private saveReminders(reminders: VaccineReminder[]): void {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(reminders)
    );
  }
}
