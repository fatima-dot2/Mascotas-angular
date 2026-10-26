import {Injectable} from '@angular/core';

export interface PetFavorite {
    id: string;
    name: string;
    type: 'perro' | 'gato';
    image?: string;
    origin?: string;
    temperament?: string;
    life_span?: string;
}

@Injectable({
    providedIn: "root"
})

export class FavoriteService {
    private storgeKey = "petcare-favorites";

    getFavorites(): PetFavorite[] {
        try {
            const saved = localStorage.getItem(this.storgeKey);
            return saved ? JSON.parse(saved) : [];
        } catch {
          return [];
        }
}

isFavorite (id: string, type: 'perro' | 'gato'): boolean {
    return this.getFavorites().some(
        pet => pet.id === id && pet.type === type
    );
}

toggleFavorite(pet: PetFavorite): void {
    const favorites = this.getFavorites();

    const index = favorites.findIndex(
        item => item.id === pet.id && item.type === pet.type
    );

    if (index >=0) {
        favorites.splice(index, 1);
    } else {
        favorites.push(pet);
    }
    localStorage.setItem(this.storgeKey, JSON.stringify(favorites));
}

removeFavorite(id: string, type: 'perro' | 'gato'): void {
    const favorites = this.getFavorites().filter(
        pet => !(pet.id === id && pet.type === type)
    );

    localStorage.setItem(this.storgeKey, JSON.stringify(favorites));
}
}