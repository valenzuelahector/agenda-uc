import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarAnularReservaComponent } from './confirmar-anular-reserva.component';

describe('ConfirmarAnularReservaComponent', () => {
  let component: ConfirmarAnularReservaComponent;
  let fixture: ComponentFixture<ConfirmarAnularReservaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmarAnularReservaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmarAnularReservaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
