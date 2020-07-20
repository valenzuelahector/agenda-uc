import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicosAsociadosComponent } from './medicos-asociados.component';

describe('MedicosAsociadosComponent', () => {
  let component: MedicosAsociadosComponent;
  let fixture: ComponentFixture<MedicosAsociadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicosAsociadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicosAsociadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
