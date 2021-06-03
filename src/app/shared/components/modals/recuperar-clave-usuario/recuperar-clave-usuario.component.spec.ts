import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecuperarClaveUsuarioComponent } from './recuperar-clave-usuario.component';

describe('RecuperarClaveUsuarioComponent', () => {
  let component: RecuperarClaveUsuarioComponent;
  let fixture: ComponentFixture<RecuperarClaveUsuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecuperarClaveUsuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecuperarClaveUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
