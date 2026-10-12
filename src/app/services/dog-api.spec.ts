import { TestBed } from '@angular/core/testing';
import { DogApi } from './dog-api';

describe('DogApi', () => {
  let service: DogApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DogApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
