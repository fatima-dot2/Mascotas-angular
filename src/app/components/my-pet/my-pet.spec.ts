import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyPets } from './my-pet';

describe('MyPets', () => {
  let component: MyPets;
  let fixture: ComponentFixture<MyPets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyPets],
    }).compileComponents();

    fixture = TestBed.createComponent(MyPets);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
