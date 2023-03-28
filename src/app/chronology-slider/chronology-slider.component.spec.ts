import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChronologySliderComponent } from './chronology-slider.component';

describe('ChronologySliderComponent', () => {
  let component: ChronologySliderComponent;
  let fixture: ComponentFixture<ChronologySliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChronologySliderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChronologySliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
