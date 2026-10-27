
import { Injectable } from '@angular/core';

export type PetType = 'perro' | 'gato' | 'otro';

export type HealthEventType =
  | 'Vacuna'
  | 'Desparasitación'
  | 'Consulta veterinaria'
  | 'Medicamento indicado'
  | 'Alergia'
  | 'Otro';

export interface HealthRecord {
  id: number;
  petName: string;
  petType: PetType;
  date: string;
  eventType: HealthEventType;
  veterinarian: string;
  details: string;
  appointmentId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class HealthRecordService {
  private readonly storageKey = 'petcare-health-records';

  getRecords(): HealthRecord[] {
    try {
      const saved = localStorage.getItem(this.storageKey);

      if (!saved) {
        return [];
      }

      const records: HealthRecord[] = JSON.parse(saved);

      return Array.isArray(records) ? records : [];
    } catch {
      return [];
    }
  }

  addRecord(record: Omit<HealthRecord, 'id'>): void {
    const records = this.getRecords();

    records.push({
      ...record,
      id: Date.now()
    });

    this.saveRecords(records);
  }

  hasRecordForAppointment(appointmentId: number): boolean {
    return this.getRecords().some(
      record => record.appointmentId === appointmentId
    );
  }

  deleteRecord(id: number): void {
    const records = this.getRecords()
      .filter(record => record.id !== id);

    this.saveRecords(records);
  }

  private saveRecords(records: HealthRecord[]): void {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(records)
    );
  }
}
