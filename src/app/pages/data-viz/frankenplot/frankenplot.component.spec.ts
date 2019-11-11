import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrankenplotComponent } from './frankenplot.component';

describe('FrankenplotComponent', () => {
  let component: FrankenplotComponent;
  let fixture: ComponentFixture<FrankenplotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrankenplotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrankenplotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
