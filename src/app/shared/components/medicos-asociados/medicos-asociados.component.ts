import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { ENV } from 'src/environments/environment';
import { AgendaAmbulatoriaService } from 'src/app/services/agenda-ambulatoria.service';
import { OrderPipe } from 'ngx-order-pipe';

@Component({
  selector: 'app-medicos-asociados',
  templateUrl: './medicos-asociados.component.html',
  styleUrls: ['./medicos-asociados.component.scss']
})
export class MedicosAsociadosComponent implements OnInit, OnDestroy {
  
  @Output() medBuscaCalendario: EventEmitter<any> = new EventEmitter();
  @Input() medicosAsociados = [];
  @Input() title = 'REVISA QUÉ OTROS MÉDICOS TIENEN HORAS DISPONIBLES';
  
  subMedicos;
  detalleBusqueda;
  counterLoader = 0;
  compensacion = -240;
  recursos = [];
  displayRecursos = false;
  loading = true;

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

  constructor(
    public utils:UtilsService,
    public agendaService:AgendaAmbulatoriaService,
    public orderPipe: OrderPipe
  ) { }

  ngOnInit() {

    this.subMedicos = this.utils.getDataProfesionalRelacionado().subscribe( data => {
      this.detalleBusqueda = data;
      this.loading = true;
      this.displayRecursos = false;
      this.getRecursosRelacionados();
    });

  }

  ngOnDestroy(){
    this.subMedicos.unsubscribe();
  }

  buscarCalendario(datosBusqueda){
    this.medBuscaCalendario.emit(datosBusqueda);
  }

  getRecursosRelacionados() {

    return new Promise((resolve, reject) => {

      let fechaHoy = new Date();
      let fechaLimite;

      fechaHoy.setMonth(fechaHoy.getMonth() + this.counterLoader);
      fechaLimite = new Date(fechaHoy.getFullYear(), fechaHoy.getMonth() + 1, 0)

      fechaHoy = new Date(this.utils.toLocalScl(fechaHoy, this.compensacion, 'YYYY-MM-DDTHH:mm:ss'));

      if (this.counterLoader > 0) {
        fechaHoy.setDate(1)
        fechaHoy.setHours(0);
        fechaHoy.setMinutes(0);
        fechaHoy.setSeconds(0);
      }

      fechaLimite = new Date(this.utils.toLocalScl(fechaLimite, this.compensacion, 'YYYY-MM-DDTHH:mm:ss'));
      fechaLimite = new Date(fechaLimite.getFullYear(), fechaLimite.getMonth() + 1, 0);
      fechaLimite.setHours(23);
      fechaLimite.setMinutes(59);
      fechaLimite.setSeconds(59);

      this.agendaService.getRecursos({
        todosCentro: true,
        idCentro: this.detalleBusqueda.centroAtencion.idRegion,
        fechaInicio: this.utils.trDateStr(fechaHoy, null, this.compensacion),
        fechaTermino: this.utils.trDateStr(fechaLimite, null, this.compensacion),
        idServicio: this.detalleBusqueda.especialidad.idServicio,
        idPlanSalud: ENV.idPlanSaludInit,
        idProfesional: null,
        fromProfRel: true
      }).subscribe(data => {

        data = this.filtrarRecursosSoloProfesional(data);

        if (data['listaRecursos'] && data['listaRecursos'].length > 0) {
          data['listaRecursos'].forEach((val, key) => {
            data['listaRecursos'][key]['proximaHoraEpoch'] = val['proximaHoraDisponible']['cupo']['horaEpoch'];
          });

          this.recursos = this.orderPipe.transform(data['listaRecursos'], 'proximaHoraEpoch');
          this.loading = false;
          this.displayRecursos = true;

        } else if (this.counterLoader <= 6) {
          
          this.counterLoader++;
          this.getRecursosRelacionados();

        } else {

          this.loading = false;
          this.displayRecursos = false;
        
        }

        resolve(data);

      })
    })

  }

  filtrarRecursosSoloProfesional(data) {

    let recursos = [];
    if (data['listaRecursos']) {
      data['listaRecursos'].forEach((val, key) => {
        if (val['tipoRecurso'].toLowerCase() != 'room') {
          recursos.push(val);
        }
      })
    }
    data['listaRecursos'] = recursos;
    return data;
  }
}
