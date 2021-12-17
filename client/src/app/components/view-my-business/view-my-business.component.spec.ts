import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMyBusinessComponent } from './view-my-business.component';

describe('ViewMyBusinessComponent', () => {
  let component: ViewMyBusinessComponent;
  let fixture: ComponentFixture<ViewMyBusinessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMyBusinessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMyBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
