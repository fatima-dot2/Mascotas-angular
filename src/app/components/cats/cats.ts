
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatApiService, CatBreed } from '../../services/cat-api';

@Component({
  selector: 'app-cats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cats.html'
})
export class Cats implements OnInit {
  breeds: CatBreed[] = [];
  loading = true;
  error = '';

  constructor(
    private catApi: CatApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.catApi.getBreeds().subscribe({
      next: (data) => {
        console.log('Razas de gatos obtenidas:', data.length);
        this.breeds = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al consultar TheCatAPI:', err);
        this.error = 'No se pudieron cargar las razas de gatos. Intenta nuevamente.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
