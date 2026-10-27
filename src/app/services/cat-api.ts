
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CatBreed {
  id: string;
  name: string;
  temperament?: string;
  life_span?: string;
  origin?: string;
  weight?: {
  imperial: string;
  metric: string;
};

description?: string;
adaptability?: number;
affection_level?: number;
child_friendly?: number;
dog_friendly?: number;
energy_level?: number;
grooming?: number;
intelligence?: number;
social_needs?: number;
vocalisation?: number;
  image?: {
    url: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CatApiService {
  private apiUrl = 'https://api.thecatapi.com/v1/breeds';

  constructor(private http: HttpClient) {}

  getBreeds(): Observable<CatBreed[]> {
    const headers = new HttpHeaders({
      'x-api-key': 'live_yA8mzBpF58ED8bs3OxX8Hh7u0e4g6wYDrrI4c3DNyHoCWtq0KMvdzmVMMhJFBpd0'
    });

    return this.http.get<CatBreed[]>(this.apiUrl, { headers });
  }
}
