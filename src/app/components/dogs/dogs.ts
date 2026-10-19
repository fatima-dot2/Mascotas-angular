
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DogApiService, Dog } from '../../services/dog-api';

@Component({
  selector: 'app-dogs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dogs.html'
})
export class Dogs implements OnInit {
  breeds: Dog[] = [];
  loading = true;
  error = '';

  constructor(
    private dogApi: DogApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.dogApi.getBreeds().subscribe({
      next: (data) => {
        console.log('Razas obtenidas:', data.length);
        this.breeds = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al consultar TheDogAPI:', err);
        this.error = 'No se pudieron cargar las razas. Intenta nuevamente.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
