import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-medicos-asociados',
  templateUrl: './medicos-asociados.component.html',
  styleUrls: ['./medicos-asociados.component.scss']
})
export class MedicosAsociadosComponent implements OnInit {
  
  @Output() medBuscaCalendario: EventEmitter<any> = new EventEmitter();
  @Input() medicosAsociados = [];

  slideConfig = {
    slidesToShow: 4, 
    slidesToScroll: 4, 
    infinite: false,  
    dots: true, 
    arrows: true,
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
          dots: false
        }
      }
    ] 
  };

  constructor() { }

  ngOnInit() {
  }
  
  slickInit(e) {
    console.log('slick initialized');
  }
  
  breakpoint(e) {
    console.log('breakpoint');
  }
  
  afterChange(e) {
    console.log('afterChange');
  }
  
  beforeChange(e) {
    console.log('beforeChange');
  }

  buscarCalendario(datosBusqueda){
    this.medBuscaCalendario.emit(datosBusqueda);
  }
}
