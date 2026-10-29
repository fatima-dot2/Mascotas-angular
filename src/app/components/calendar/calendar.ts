
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  Appointment,
  AppointmentService
} from '../../services/appointment';

import {
  ReminderService,
  VaccineReminder
} from '../../services/reminder';

type CalendarView = 'month' | 'week';

interface CalendarEvent {
  id: string;
  kind: 'appointment' | 'vaccine';
  title: string;
  petName: string;
  date: string;
  time?: string;
  description?: string;
  status: string;
}

interface CalendarDay {
  date: string;
  number: number;
  isToday: boolean;
  inCurrentMonth: boolean;
  events: CalendarEvent[];
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.html'
})
export class Calendar {
  view: CalendarView = 'month';

  weekDayNames = [
    'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'
  ];

  days: CalendarDay[] = [];
  weekDays: CalendarDay[] = [];

  selectedDate = this.toDateString(new Date());
  monthTitle = '';
  allEvents: CalendarEvent[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private reminderService: ReminderService
  ) {
    this.refreshCalendar();
  }

  private toDateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private parseDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  private getToday(): string {
    return this.toDateString(new Date());
  }

  get selectedDateLabel(): string {
    return this.parseDate(this.selectedDate).toLocaleDateString(
      'es-MX',
      {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }
    );
  }

  get selectedEvents(): CalendarEvent[] {
    return this.allEvents
      .filter(event => event.date === this.selectedDate)
      .sort((a, b) =>
        (a.time ?? '').localeCompare(b.time ?? '')
      );
  }

  refreshCalendar(): void {
    const appointments = this.appointmentService.getAppointments();
    const reminders = this.reminderService.getReminders();

    this.allEvents = [
      ...appointments.map(appointment =>
        this.mapAppointment(appointment)
      ),
      ...reminders.map(reminder =>
        this.mapReminder(reminder)
      )
    ];

    this.buildCalendar();
  }

  private mapAppointment(
    appointment: Appointment
  ): CalendarEvent {
    const appointmentTime = new Date(
      `${appointment.date}T${appointment.time}`
    );

    let status: string = appointment.status ?? 'Pendiente';

    if (
      status !== 'Completada' &&
      appointmentTime.getTime() < Date.now()
    ) {
      status = 'Finalizada';
    }

    return {
      id: `appointment-${appointment.id}`,
      kind: 'appointment',
      title: appointment.reason || 'Consulta veterinaria',
      petName: appointment.petName,
      date: appointment.date,
      time: appointment.time,
      description: `Veterinario: ${appointment.veterinarian}`,
      status
    };
  }

  private mapReminder(
    reminder: VaccineReminder
  ): CalendarEvent {
    return {
      id: `vaccine-${reminder.id}`,
      kind: 'vaccine',
      title: reminder.vaccine,
      petName: reminder.petName,
      date: reminder.date,
      description: [
        reminder.veterinarian
          ? `Veterinario: ${reminder.veterinarian}`
          : '',
        reminder.notes || ''
      ].filter(Boolean).join(' · '),
      status: this.getReminderStatus(reminder.date)
    };
  }

  private buildCalendar(): void {
    const selected = this.parseDate(this.selectedDate);
    const currentMonth = selected.getMonth();
    const currentYear = selected.getFullYear();

    this.monthTitle = selected.toLocaleDateString('es-MX', {
      month: 'long',
      year: 'numeric'
    });

    const firstOfMonth = new Date(
      currentYear,
      currentMonth,
      1
    );

    const mondayOffset = (firstOfMonth.getDay() + 6) % 7;

    const firstCell = new Date(
      currentYear,
      currentMonth,
      1 - mondayOffset
    );

    this.days = [];

    for (let i = 0; i < 42; i++) {
      const date = new Date(firstCell);
      date.setDate(firstCell.getDate() + i);

      this.days.push(this.createDay(date, currentMonth));
    }

    const selectedWeekStart = new Date(selected);
    const selectedOffset =
      (selectedWeekStart.getDay() + 6) % 7;

    selectedWeekStart.setDate(
      selectedWeekStart.getDate() - selectedOffset
    );

    this.weekDays = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(selectedWeekStart);
      date.setDate(selectedWeekStart.getDate() + i);

      this.weekDays.push(this.createDay(date, currentMonth));
    }
  }

  private createDay(
    date: Date,
    currentMonth: number
  ): CalendarDay {
    const dateString = this.toDateString(date);

    return {
      date: dateString,
      number: date.getDate(),
      isToday: dateString === this.getToday(),
      inCurrentMonth: date.getMonth() === currentMonth,
      events: this.allEvents.filter(
        event => event.date === dateString
      )
    };
  }

  selectDay(day: CalendarDay): void {
    this.selectedDate = day.date;
    this.buildCalendar();
  }

  selectView(view: CalendarView): void {
    this.view = view;
    this.buildCalendar();
  }

  goToToday(): void {
    this.selectedDate = this.getToday();
    this.buildCalendar();
  }

  previousPeriod(): void {
    const date = this.parseDate(this.selectedDate);

    if (this.view === 'month') {
      date.setDate(1);
      date.setMonth(date.getMonth() - 1);
    } else {
      date.setDate(date.getDate() - 7);
    }

    this.selectedDate = this.toDateString(date);
    this.buildCalendar();
  }

  nextPeriod(): void {
    const date = this.parseDate(this.selectedDate);

    if (this.view === 'month') {
      date.setDate(1);
      date.setMonth(date.getMonth() + 1);
    } else {
      date.setDate(date.getDate() + 7);
    }

    this.selectedDate = this.toDateString(date);
    this.buildCalendar();
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

  trackByEvent(
    index: number,
    event: CalendarEvent
  ): string {
    return event.id;
  }
}
