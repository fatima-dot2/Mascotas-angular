
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatApiService, CatBreed } from '../../services/cat-api';

@Component({
  selector: 'app-cats',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cats.html'
})
export class Cats implements OnInit {
  breeds: CatBreed[] = [];
  searchText = '';
  loading = true;
  error = '';

  constructor(
    private catApi: CatApiService,
    private cdr: ChangeDetectorRef
  ) {}

  get filteredBreeds(): CatBreed[] {
    return this.breeds.filter(cat =>
      cat.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

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
