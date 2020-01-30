import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmacionAnulacionReservaComponent } from './confirmacion-anulacion-reserva.component';

describe('ConfirmacionAnulacionReservaComponent', () => {
  let component: ConfirmacionAnulacionReservaComponent;
  let fixture: ComponentFixture<ConfirmacionAnulacionReservaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmacionAnulacionReservaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmacionAnulacionReservaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
