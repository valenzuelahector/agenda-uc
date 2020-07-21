import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-medicos-asociados',
  templateUrl: './medicos-asociados.component.html',
  styleUrls: ['./medicos-asociados.component.scss']
})
export class MedicosAsociadosComponent implements OnInit {
  
  @Output() medBuscaCalendario: EventEmitter<any> = new EventEmitter();
  @Input() medicosAsociados = [];
  @Input() title = 'REVISA QUÉ OTROS MÉDICOS TIENEN HORAS DISPONIBLES';

  slideConfig = {
    slidesToShow: 3, 
    slidesToScroll: 3, 
    infinite: false,  
    dots: true, 
    arrows: false,
    responsive: [
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: false,
          dots: true
        }
      },
      {
        breakpoint: 720,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
          dots: true
        }
      }
    ] 
  };

  constructor() { }

  ngOnInit() {
  }

  buscarCalendario(datosBusqueda){
    this.medBuscaCalendario.emit(datosBusqueda);
  }
}
