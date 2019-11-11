import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlasscaComponent } from './alassca.component';

describe('AlasscaComponent', () => {
  let component: AlasscaComponent;
  let fixture: ComponentFixture<AlasscaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlasscaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlasscaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
