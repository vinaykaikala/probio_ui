import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiqbioComponent } from './liqbio.component';

describe('LiqbioComponent', () => {
  let component: LiqbioComponent;
  let fixture: ComponentFixture<LiqbioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiqbioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiqbioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
