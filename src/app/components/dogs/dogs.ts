
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DogApiService, Dog } from '../../services/dog-api';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-dogs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dogs.html'
})
export class Dogs implements OnInit {

  breeds: Dog[] = [];
  searchText = '';
  loading = true;
  error = '';
  favorites = new Set<string>();

  constructor(
    private dogApi: DogApiService,
    private cdr: ChangeDetectorRef,
    private favoriteService: FavoriteService
  ) {}

  get filteredBreeds(): Dog[] {
    return this.breeds.filter(dog =>
      dog.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  ngOnInit(): void {
    this.updateFavorites();

    this.dogApi.getBreeds().subscribe({
      next: (data) => {
        console.log('Razas obtenidas:', data.length);
        this.breeds = data;
        this.loading = false;
        this.updateFavorites();
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

  isFavorite(id: number): boolean {
    return this.favorites.has(String(id));
  }

  toggleFavorite(dog: Dog): void {
    this.favoriteService.toggleFavorite({
      id: String(dog.id),
      name: dog.name,
      type: 'perro',
      image: dog.image?.url,
      origin: dog.origin,
      temperament: dog.temperament,
      life_span: dog.life_span
    });

    this.updateFavorites();
  }

  updateFavorites(): void {
    const saved = this.favoriteService.getFavorites();

    this.favorites = new Set(
      saved
        .filter(pet => pet.type === 'perro')
        .map(pet => pet.id)
    );
  }
}
