
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CatBreed {
  id: string;
  name: string;
  temperament?: string;
  life_span?: string;
  origin?: string;
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
    return this.http.get<CatBreed[]>(this.apiUrl);
  }
}
