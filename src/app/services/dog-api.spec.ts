import { TestBed } from '@angular/core/testing';
import { DogApiService } from './dog-api';
import {provideHttpClient} from "@angular/common/http";

describe('DogApi', () => {
  let service: DogApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(DogApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
