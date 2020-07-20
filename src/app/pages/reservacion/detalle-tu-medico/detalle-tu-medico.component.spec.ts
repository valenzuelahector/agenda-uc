import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTuMedicoComponent } from './detalle-tu-medico.component';

describe('DetalleTuMedicoComponent', () => {
  let component: DetalleTuMedicoComponent;
  let fixture: ComponentFixture<DetalleTuMedicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleTuMedicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTuMedicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
