import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AgendaAmbulatoriaService } from 'src/app/services/agenda-ambulatoria.service';
import { ENV } from 'src/environments/environment';

@Component({
  selector: 'app-proximas-horas',
  templateUrl: './proximas-horas.component.html',
  styleUrls: ['./proximas-horas.component.scss']
})
export class ProximasHorasComponent implements OnInit {

  @Output() seleccionProximaHora: EventEmitter<any> = new EventEmitter();

  proximasHoras = [];
  displayCarousel = false;
  loading = true;

  slideConfig = {
    slidesToShow: 3, 
    slidesToScroll: 3, 
    infinite: false,  
    dots: false, 
    arrows: false,
    responsive: [
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
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

  constructor(
    public agendaService:AgendaAmbulatoriaService
  ) { }

  ngOnInit() {
    this.buscarCalendario();
  }

  buscarCalendario(){

    this.agendaService.getCuposInmediatos().then( res => {
      this.loading = false;
      this.displayCarousel = true;
      if(res['listaCuposInmediatos'] && res['listaCuposInmediatos'].length > 0){
        res['listaCuposInmediatos'].forEach((val, key) => {
          val['listaServicios'][0]['idServicio'] = val['listaServicios'][0]['id'];
          const item = {
            title: val['listaServicios'][0]['nombreEspecialidad'],
            description: `${val['cantidadCupos']} cupos disponibles dentro de las próximas ${val['ventanaTiempo']} horas.`,
            itemSearch: {
              area: ENV.areaConsultaMedica,
              especialidad: val['listaServicios'][0],
              profesional: null,
              centroAtencion: {
                codigo: 'todos',
                detalle: 'Todos',
                idCentro: ENV.idRegion,
                idRegion: ENV.idRegion,
                nombre: 'Todos', 
                direccion: {
                  calle: null,
                  comuna: "Región Metropolitana",
                  numero: null,
                  piso: null,
                }
              }
            }
          }
          this.proximasHoras.push(item);
        });
      }
    });
  }

  procesarSeleccion(data){
    this.seleccionProximaHora.emit(data);
  }
}
