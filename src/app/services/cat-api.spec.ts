import { TestBed } from '@angular/core/testing';
import { CatApi } from './cat-api';

describe('CatApi', () => {
  let service: CatApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
