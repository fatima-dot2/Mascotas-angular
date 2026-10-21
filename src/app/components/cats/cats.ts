
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatApiService, CatBreed } from '../../services/cat-api';
import { FavoriteService } from '../../services/favorite.service';

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
  favorites = new Set<string>();

  constructor(
    private catApi: CatApiService,
    private cdr: ChangeDetectorRef,
    private favoriteService: FavoriteService
  ) {}

  get filteredBreeds(): CatBreed[] {
    return this.breeds.filter(cat =>
      cat.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  ngOnInit(): void {
    this.updateFavorites();

    this.catApi.getBreeds().subscribe({
      next: (data) => {
        console.log('Razas de gatos obtenidas:', data.length);
        this.breeds = data;
        this.loading = false;
        this.updateFavorites();
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

 isFavorite(id: string | number): boolean {
  return this.favorites.has(String(id));
}

  toggleFavorite(cat: CatBreed): void {
    this.favoriteService.toggleFavorite({
      id: String(cat.id),
      name: cat.name,
      type: 'gato',
      image: cat.image?.url,
      origin: cat.origin,
      temperament: cat.temperament,
      life_span: cat.life_span
    });

    this.updateFavorites();
  }

  updateFavorites(): void {
    const saved = this.favoriteService.getFavorites();

    this.favorites = new Set(
      saved
        .filter(pet => pet.type === 'gato')
        .map(pet => pet.id)
    );
  }
}
