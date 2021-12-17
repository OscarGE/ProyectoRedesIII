import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTheBusinessComponent } from './view-the-business.component';

describe('ViewTheBusinessComponent', () => {
  let component: ViewTheBusinessComponent;
  let fixture: ComponentFixture<ViewTheBusinessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTheBusinessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTheBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
