import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BreedDetail } from './breed-detail';

describe('BreedDetail', () => {
  let component: BreedDetail;
  let fixture: ComponentFixture<BreedDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreedDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(BreedDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
