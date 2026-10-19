
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Dog {
  id: number;
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
export class DogApiService {
  private apiUrl = 'https://api.thedogapi.com/v1/breeds';

  constructor(private http: HttpClient) {}

  getBreeds(): Observable<Dog[]> {
    const headers = new HttpHeaders({
      'x-api-key': 'DEMO-API-KEY'
    });

    return this.http.get<Dog[]>(this.apiUrl, { headers });
  }
}
