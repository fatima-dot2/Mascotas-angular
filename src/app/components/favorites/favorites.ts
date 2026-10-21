import { Component, OnInit } from '@angular/core';
import { CommonModule} from '@angular/common';
import {
  FavoriteService,
  PetFavorite
} from '../../services/favorite.service';

@Component({
  imports: [],
  selector: 'app-favorites',
  styleUrl: './favorites.css',
  templateUrl: './favorites.html',
})
export class Favorites implements OnInit {
  favorites: PetFavorite[] = [];

  constructor (private favoriteService: FavoriteService) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.favorites = this.favoriteService.getFavorites();
  }

  removeFavorite(pet: PetFavorite): void {
    this.favoriteService.removeFavorite(pet.id, pet.type);
    this.loadFavorites();
  }

  }