import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChronologyRealTimeComponent } from './chronology-realtime.component';

describe('ChronologySliderComponent', () => {
  let component: ChronologyRealTimeComponent;
  let fixture: ComponentFixture<ChronologyRealTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChronologyRealTimeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChronologyRealTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
