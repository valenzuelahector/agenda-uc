import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-proximas-horas',
  templateUrl: './proximas-horas.component.html',
  styleUrls: ['./proximas-horas.component.scss']
})
export class ProximasHorasComponent implements OnInit {

  @Output() seleccionProximaHora: EventEmitter<any> = new EventEmitter();

  proximasHoras = [];
  displayCarousel = false;
  slideConfig = {
    slidesToShow: 4, 
    slidesToScroll: 4, 
    infinite: false,  
    dots: false, 
    arrows: false,
    responsive: [
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: false,
          dots: false
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

    setTimeout(()=> {
      this.displayCarousel = true;
    },2500);

    this.proximasHoras = [
      { title: "Kinesiología", description: "5 cupos disponibles dentro de las próximas 6 horas." },
      { title: "Kinesiología", description: "5 cupos disponibles dentro de las próximas 6 horas." },
      { title: "Kinesiología", description: "5 cupos disponibles dentro de las próximas 6 horas." },
      { title: "Kinesiología", description: "5 cupos disponibles dentro de las próximas 6 horas." },
      { title: "Kinesiología", description: "5 cupos disponibles dentro de las próximas 6 horas." },
      { title: "Kinesiología", description: "5 cupos disponibles dentro de las próximas 6 horas." }
    ];

  }

  buscarCalendario(){

  }
}
