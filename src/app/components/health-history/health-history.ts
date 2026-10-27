
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  HealthRecord,
  HealthRecordService,
  PetType,
  HealthEventType
} from '../../services/health-record';

@Component({
  selector: 'app-health-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './health-history.html',
  styleUrl: './health-history.css'
})
export class HealthHistory {
  records: HealthRecord[] = [];

  petName = '';
  petType: PetType = 'perro';
  date = this.getToday();
  eventType: HealthEventType = 'Consulta veterinaria';
  veterinarian = '';
  details = '';

  searchText = '';
  selectedPet: 'todos' | PetType = 'todos';

  error = '';
  success = '';

  minDate = this.getToday();

  readonly eventTypes: HealthEventType[] = [
    'Vacuna',
    'Desparasitación',
    'Consulta veterinaria',
    'Medicamento indicado',
    'Alergia',
    'Otro'
  ];

  constructor(
    private healthRecordService: HealthRecordService
  ) {
    this.loadRecords();
  }

  private getToday(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  loadRecords(): void {
    this.records = this.healthRecordService
      .getRecords()
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  get filteredRecords(): HealthRecord[] {
    const search = this.searchText.trim().toLowerCase();

    return this.records.filter(record => {
      const matchesPet =
        this.selectedPet === 'todos' ||
        record.petType === this.selectedPet;

      const matchesSearch =
        record.petName.toLowerCase().includes(search) ||
        record.eventType.toLowerCase().includes(search) ||
        record.details.toLowerCase().includes(search) ||
        record.veterinarian.toLowerCase().includes(search);

      return matchesPet && matchesSearch;
    });
  }

  addRecord(): void {
    this.error = '';
    this.success = '';

    if (
      !this.petName.trim() ||
      !this.date ||
      !this.eventType ||
      !this.details.trim()
    ) {
      this.error = 'Completa los campos obligatorios.';
      return;
    }

    if (this.date > this.getToday()) {
      this.error = 'La fecha del registro no puede ser futura.';
      return;
    }

    this.healthRecordService.addRecord({
      petName: this.petName.trim(),
      petType: this.petType,
      date: this.date,
      eventType: this.eventType,
      veterinarian: this.veterinarian.trim(),
      details: this.details.trim()
    });

    this.loadRecords();

    this.petName = '';
    this.petType = 'perro';
    this.date = this.getToday();
    this.eventType = 'Consulta veterinaria';
    this.veterinarian = '';
    this.details = '';

    this.success = 'El registro de salud se guardó correctamente.';
  }

  deleteRecord(id: number): void {
    const confirmed = confirm(
      '¿Deseas eliminar este registro del historial?'
    );

    if (!confirmed) {
      return;
    }

    this.healthRecordService.deleteRecord(id);
    this.loadRecords();

    this.success = 'El registro se eliminó correctamente.';
    this.error = '';
  }

  selectPet(pet: 'todos' | PetType): void {
    this.selectedPet = pet;
  }
}
