
import { TestBed } from '@angular/core/testing';
import { ReminderService } from './reminder';

describe('ReminderService', () => {
  let service: ReminderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReminderService);
  });

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debe devolver una lista de recordatorios', () => {
    expect(Array.isArray(service.getReminders())).toBe(true);
  });
});
