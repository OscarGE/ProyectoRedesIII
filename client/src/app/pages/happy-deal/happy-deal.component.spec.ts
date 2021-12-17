import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HappyDealComponent } from './happy-deal.component';

describe('HappyDealComponent', () => {
  let component: HappyDealComponent;
  let fixture: ComponentFixture<HappyDealComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HappyDealComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HappyDealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
