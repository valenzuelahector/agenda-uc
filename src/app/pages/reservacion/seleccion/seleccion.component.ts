import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ViewChild, HostListener } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { AgendaAmbulatoriaService } from 'src/app/services/agenda-ambulatoria.service';
import { MatCalendarCellCssClasses } from '@angular/material';
import { PerfilProfesionalComponent } from 'src/app/shared/components/modals/perfil-profesional/perfil-profesional.component';
import { MatDialog } from '@angular/material';
import { OrderPipe } from 'ngx-order-pipe';
import { ENV } from 'src/environments/environment';
import gtag, { install } from 'ga-gtag';
import * as $ from 'jquery';
import * as moment from 'moment';
import 'moment-timezone';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-seleccion',
  templateUrl: './seleccion.component.html',
  styleUrls: ['./seleccion.component.scss']
})
export class SeleccionComponent implements OnInit, OnChanges {

  @Input() busquedaInicial: any;
  @Input() reloadBusqueda: number = 0;
  @Output() calendario: EventEmitter<any> = new EventEmitter();

  public recursos: any;
  public fechaHoy: Date;
  public fechaLimite: Date;
  public datesToHighlight: any = {}
  public selectedDate: any = {};
  public maxNumDays: number = 90;
  public centrosProfesional: any = {};
  public loadedRecursos: boolean = false;
  public tiposCitas: any = [];
  public dayWeekFixed = false;
  public counterLoader = 0;
  public displayCalendar: boolean = true;
  public contadorMeses = 1;
  public enableScroll: boolean = false;
  public compensacion = -240;
  public horaSeleccionada:any;
  public navigationDate = {
    min: null,
    max: null
  }

  public emitterReloadBusqueda: any;
  public customMensaje: string = "";

  constructor(
    public agendaService: AgendaAmbulatoriaService,
    public utils: UtilsService,
    public dialog: MatDialog,
    public sanitizer: DomSanitizer,
    public orderPipe: OrderPipe
  ) { }

  ngOnInit() {
  }

  getOffsetTop(element) {
    let offsetTop = 0;
    while (element) {
      offsetTop += element.offsetTop;
      element = element.offsetParent;
    }
    return offsetTop;
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    if (this.enableScroll) {
      let wPos = window.scrollY;
      let dayWeekPos = this.getOffsetTop((<HTMLElement>document.getElementById('dayWeek')));
      this.dayWeekFixed = (wPos >= dayWeekPos) ? true : false
    }

  }

  ngOnChanges() {

    if (this.busquedaInicial) {

      this.navigationDate = { min: null, max: null };
      this.counterLoader = 0;
      this.displayCalendar = true;

      if (this.busquedaInicial && this.busquedaInicial.especialidad) {
        this.resetCalendario();
        if (this.busquedaInicial.profesional) {
          this.getRecursos(this.busquedaInicial.profesional.idProfesional);
        } else {
          this.getRecursos();
        }
      } else {
        this.resetCalendario();
      }
    }

  }

  resetCalendario() {
    this.datesToHighlight = {};
    this.selectedDate = {};
    this.recursos = [];
    this.centrosProfesional = {};
    this.loadedRecursos = false;
    this.enableScroll = false;
  }

  async navigateMonth(action) {

    this.displayCalendar = false;

    switch (action) {
      case 'next':
        this.counterLoader++;
      break;

      case 'prev':
        this.counterLoader--;
      break;

    }

    if (this.busquedaInicial.profesional) {
      this.getRecursos(this.busquedaInicial.profesional.idProfesional);
    } else {
      this.getRecursos();
    }

    this.goTop();

  }

  goTop() {
    let dayWeekPos = this.getOffsetTop((<HTMLElement>document.getElementById('dayWeek')));
    $("body, html").animate({
      scrollTop: dayWeekPos + "px"
    }, 500)
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

  getRecursos(idProfesional = null, next = false) {

    return new Promise((resolve, reject) => {

      var fechaHoy = new Date();
      var fechaLimite;

      fechaHoy.setMonth(fechaHoy.getMonth() + this.counterLoader);
      fechaLimite = new Date(fechaHoy.getFullYear(), fechaHoy.getMonth() + 1, 0)

      fechaHoy = new Date(this.utils.toLocalScl(fechaHoy, this.compensacion, 'YYYY-MM-DDTHH:mm:ss'))

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

      this.navigationDate = { min: fechaHoy, max: fechaLimite }
      console.log(fechaHoy)
      this.agendaService.getRecursos({
        todosCentro: (this.busquedaInicial.centroAtencion.codigo == 'todos') ? true : false,
        idCentro: this.busquedaInicial.centroAtencion.idCentro,
        fechaInicio: this.utils.trDateStr(fechaHoy, null, this.compensacion),
        fechaTermino: this.utils.trDateStr(fechaLimite, null, this.compensacion),
        idServicio: this.busquedaInicial.especialidad.idServicio,
        idPlanSalud: ENV.idPlanSaludInit,
        idProfesional: idProfesional
      }).subscribe(data => {

        data = this.filtrarRecursosSoloProfesional(data);
        if (data['listaRecursos'] && data['listaRecursos'].length > 0) {

          data['listaRecursos'].forEach((val, key) => {
            console.log(fechaHoy)
            data['listaRecursos'][key] = this.crearCalendario(val, fechaHoy);
          })
          
          this.recursos = data['listaRecursos'];
          this.enableScroll = true;

        } else {
          this.recursos = [];
          this.setMensaje({
            CenterId: this.busquedaInicial.centroAtencion.idCentro,
            ServiceId: this.busquedaInicial.especialidad.idServicio,
            ResourceId: idProfesional
          })
        }

        this.enableScroll = true;
        this.loadedRecursos = true;
        this.displayCalendar = true;

        setTimeout(() => {
          this.utils.hideProgressBar();
        }, 1500)

        resolve(data);


      })
    })

  }

  setMensaje(data) {

    this.customMensaje = "Cargando...";

    this.agendaService.getMensajes({
      CenterId: data.CenterId,
      ServiceId: data.ServiceId,
      ResourceId: data.ResourceId
    }, 'cupo').subscribe(res => {
      this.customMensaje = "";
      if (res['mensajes'] && res['mensajes'].length > 0) {
        res['mensajes'].forEach((val, key) => {
          if (val['mensaje'] && val['mensaje']['contenido'] &&
            (
              (val['aplicaA'] && val['aplicaA']['recurso'] && data.ResourceId) ||
              (val['aplicaA'] && val['aplicaA']['servicio'] && !data.ResourceId)
            )
          ) {
            this.customMensaje += val['mensaje']['contenido'];
          }
        })
      }

      if (!this.customMensaje || this.customMensaje === "") {
        this.customMensaje = ENV.mensajeSinCupos;
      }
    })
  }

  dateClass(datesDs, compensacion) {
    return (date: Date): MatCalendarCellCssClasses => {
      let datesDisabled = JSON.parse(JSON.stringify(datesDs));

      const highlightDate = datesDisabled
        .map(strDate => new Date(this.utils.toLocalScl(strDate, this.compensacion, 'YYYY-MM-DDTHH:mm:ss')))
        .some(d => d.getDate() === date.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear());

      return highlightDate ? 'day-disabled' : '';
    };
  }

  displayCentro(idxCentro, idxItem) {
    let cet = this.centrosProfesional[idxCentro][idxItem];
    if (Object.keys(this.centrosProfesional).length > 1) {
      this.centrosProfesional[idxCentro][idxItem]['habilitado'] = (cet.habilitado) ? false : true
    } else if (Object.keys(this.centrosProfesional).length == 1) {
      this.centrosProfesional[idxCentro][idxItem]['habilitado'] = true;
    } else {
      this.centrosProfesional[idxCentro][idxItem]['habilitado'] = false;
    }
  }

  eligeOtroDia(i) {
    this.selectedDate[i] = null;
    this.centrosProfesional[i] = null
  }

  onSelect(event, i) {

    this.selectedDate[i] = event;
    let fechaDisSel = this.utils.trDateStr(event, 'json');
    let idxFecha = fechaDisSel['year'] + "-" + fechaDisSel['month'] + '-' + fechaDisSel['day'];
    let centrosProfesionales = this.recursos[i]['fechasDisponibles'][idxFecha];
    let agrupCentros: any = {};

    centrosProfesionales.forEach((val, key) => {
      if (!agrupCentros[val['idCentro']]) {
        agrupCentros[val['idCentro']] = { 'nombreCentro': val['centro']['nombre'], cupos: [], habilitado: false }
      }
      agrupCentros[val['idCentro']]['cupos'].push(val)
    })

    this.centrosProfesional[i] = [];
    let enableCentro = (Object.keys(agrupCentros).length == 1) ? true : false;

    Object.keys(agrupCentros).forEach(key => {
      agrupCentros[key]['habilitado'] = enableCentro;
      this.centrosProfesional[i].push(agrupCentros[key]);
    })

    gtag('event', 'Clic', { 'event_category': 'Reserva de Hora', 'event_label': 'Paso2:Selección-Calendario' });

  }

  crearCalendario(recurso: any, min) {

    let datesDisabled = [];
    let f = null;
    console.log(min)
    let fecha = new Date(min);
    console.log(fecha)
    fecha.setDate(1);
    fecha.setMinutes(0);
    fecha.setSeconds(0);
    fecha.setHours(6);

    recurso['fechasDisponibles'] = {};
    
    try {
      this.compensacion = recurso['listaCupos'][0]['cupos'].length > 0 ? recurso['listaCupos'][0]['cupos'][0]['compensacion'] : -180;
    } catch (err) {
      this.compensacion = -180;
    }

      for (let day = 1; day <= 40; day++) {

        if (day == 1) {
          f = this.utils.toLocalScl(fecha, this.compensacion);
        } else {
          fecha.setDate(fecha.getDate() + 1);
          f = this.utils.toLocalScl(fecha, this.compensacion);
        }
  
        f = this.utils.toStringDateJson(f);
        recurso['fechasDisponibles'][f.year + '-' + f.month + '-' + f.day] = [];
  
      }
      
    recurso['listaCupos'].forEach((valLc, keyLc) => {
      valLc['cupos'].forEach((val, key) => {

        let fechaEpoch = new Date(val['horaEpoch'] * 1000);
        let u: any = this.utils.toLocalScl(fechaEpoch, this.compensacion);
        u = this.utils.toStringDateJson(u);
        val['fechaHora'] = new Date(val['horaEpoch'] * 1000);
        val['centro'] = valLc['centro'];
        recurso['fechasDisponibles'][u['year'] + '-' + u['month']  + '-' + u['day']].push(val)

      })
    })

    recurso['datesToHighlight'] = { dates: [], displayed: false, dateClass: null };

    Object.keys(recurso['fechasDisponibles']).forEach(key => {
      if (recurso['fechasDisponibles'][key].length == 0) {
        datesDisabled.push(key + 'T12:00:00.000Z');
      }
    })

    recurso['datesToHighlight']['displayed'] = true;
    recurso['datesToHighlight']['dates'] = datesDisabled;
    recurso['datesToHighlight']['dateClass'] = this.dateClass(datesDisabled, this.compensacion);
    return recurso;

  }

  seleccionarHora(data) {
    console.log(data)
    this.horaSeleccionada = data;
    this.calendario.emit(data);
    gtag('event', 'Clic', { 'event_category': 'Reserva de Hora', 'event_label': 'Paso2:Selección-Hora' });
  }

  verPerfil(re) {
    this.utils.verPerfilProfesional(re);
  }

}