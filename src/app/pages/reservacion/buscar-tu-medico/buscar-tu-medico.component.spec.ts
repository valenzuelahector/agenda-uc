import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarTuMedicoComponent } from './buscar-tu-medico.component';

describe('BuscarTuMedicoComponent', () => {
  let component: BuscarTuMedicoComponent;
  let fixture: ComponentFixture<BuscarTuMedicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscarTuMedicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarTuMedicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
