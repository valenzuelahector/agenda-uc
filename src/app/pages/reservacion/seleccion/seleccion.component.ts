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
import * as clone from 'clone';

@Component({
  selector: 'app-seleccion',
  templateUrl: './seleccion.component.html',
  styleUrls: ['./seleccion.component.scss']
})
export class SeleccionComponent implements OnInit, OnChanges {

  @Input() busquedaInicial: any;
  @Input() reloadBusqueda: number = 0;
  @Output() calendario: EventEmitter<any> = new EventEmitter();
  @Output() readQuery: EventEmitter<any> = new EventEmitter();

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
  public horaSeleccionada: any;
  public navDirection = 'next';
  public enableAutoSearch = false;
  public numberSearchs = 0;
  public maxNumberSearch = 6;
  public navigationDate = { min: null, max: null }
  public disableNavigation = false;
  public emitterReloadBusqueda: any;
  public customMensaje: string = "";
  public keepSearching = true;
  public listaFechas = {};

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
      this.navDirection = 'next';
      this.displayCalendar = true;

      if (this.busquedaInicial && this.busquedaInicial.especialidad) {
        this.resetCalendario();
        this.crearListaFechas();
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

  determinarMesSinCupo() {

    this.recursos.forEach((val, key) => {
      let posee = false;
      let listFechaDis = Object.keys(val['fechasDisponibles']);
      listFechaDis.forEach(k => {
        let fechaEvaluar = new Date(k + "T23:59:59");
        if (fechaEvaluar.getTime() >= this.navigationDate['min'].getTime() &&
          fechaEvaluar.getTime() <= this.navigationDate['max'].getTime() &&
          val['fechasDisponibles'][k].length > 0
        ) {
          posee = true;
        }
      })
      this.recursos[key]['poseeMes'] = posee;
    })
  }

  resetCalendario() {
    this.datesToHighlight = {};
    this.selectedDate = {};
    this.recursos = [];
    this.centrosProfesional = {};
    this.loadedRecursos = false;
    this.enableScroll = false;
    this.listaFechas = {};
    this.disableNavigation = false;
    this.keepSearching = true;
  }

  async navigateMonth(action, fromBtn = false) {

    this.displayCalendar = false;

    if (fromBtn) {
      this.maxNumberSearch = 5;
    }

    switch (action) {
      case 'next':
        this.counterLoader++;
        this.navDirection = 'next';
        break;

      case 'prev':
        this.counterLoader--;
        this.navDirection = 'prev';

        break;

    }

    if (this.busquedaInicial.profesional) {
      this.getRecursos(this.busquedaInicial.profesional.idProfesional);
    } else {
      this.getRecursos();
    }

  }

  goTop() {
    let dayWeekPos = this.getOffsetTop((<HTMLElement>document.getElementById('dayWeek')));
    $("body, html").animate({
      scrollTop: "0px"
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

          this.keepSearching = false;
          this.enableAutoSearch = false;

          data['listaRecursos'].forEach((val, key) => {
            data['listaRecursos'][key] = this.crearCalendario(val, fechaHoy);
          })
          const listaRecursos = this.mergeRecursos(clone(this.recursos), data['listaRecursos'])
          this.recursos = this.orderPipe.transform(listaRecursos, 'proximaFechaEpoch');
          this.enableScroll = true;
          this.readQuery.emit(true);

          this.restoreCalendar();

        } else if (this.keepSearching) {

          if (this.counterLoader < 12 && this.navDirection == 'next') {

            this.enableAutoSearch = true;
            this.readQuery.emit(false);
            this.numberSearchs++;

            if (this.numberSearchs <= this.maxNumberSearch) {

              this.navigateMonth('next');

            } else {

              const usrMsg = (data['usrMsg']) ? data['usrMsg'] : ENV.mensajeSinCupos;
              this.setCalendarInfo(idProfesional, usrMsg);
              this.numberSearchs = 0;
              this.disableNavigation = true;

            }

          }

        } else {
          this.restoreCalendar();
        }

        this.determinarMesSinCupo();

        resolve(data);

      })
    })

  }

  restoreCalendar() {
    this.enableScroll = true;
    this.loadedRecursos = true;
    this.displayCalendar = true;
    this.dayWeekFixed = false;
    this.numberSearchs = 0;
    this.goTop();
  }

  mergeRecursos(recursosActuales, recursosNuevos) {

    let nRecursos = [];
    let found;

    recursosNuevos.forEach((valRn, keyRn) => {

      found = false;
      recursosActuales.forEach((valRa, keyRa) => {
        if (valRn['id'] === valRa['id']) {
          recursosActuales[keyRa] = valRn;
          found = true;
        }
      });

      if (!found) {
        nRecursos.push(valRn);
      }
    });

    return recursosActuales.concat(nRecursos);

  }

  setCalendarInfo(idProfesional, usrMsg) {
    this.enableAutoSearch = false;;
    this.readQuery.emit(true);
    this.recursos = [];
    this.setMensaje({
      CenterId: this.busquedaInicial.centroAtencion.idCentro,
      ServiceId: this.busquedaInicial.especialidad.idServicio,
      ResourceId: idProfesional
    }, usrMsg)
    this.enableScroll = true;
    this.loadedRecursos = true;
    this.displayCalendar = true;
    this.goTop();
  }

  setMensaje(data, usrMsg) {

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
        this.customMensaje = usrMsg;
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
    recurso['fechasDisponibles'] = {};

    try {
      this.compensacion = recurso['listaCupos'][0]['cupos'].length > 0 ? recurso['listaCupos'][0]['cupos'][0]['compensacion'] : -180;
    } catch (err) {
      this.compensacion = -180;
    }

    recurso['fechasDisponibles'] = clone(this.listaFechas);
    
    recurso['listaCupos'].forEach((valLc, keyLc) => {
      valLc['cupos'].forEach((val, key) => {

        let fechaEpoch = new Date(val['horaEpoch'] * 1000);
        let u: any = this.utils.toLocalScl(fechaEpoch, this.compensacion);
        u = this.utils.toStringDateJson(u);
        val['fechaHora'] = new Date(val['horaEpoch'] * 1000);
        val['centro'] = valLc['centro'];
        recurso['fechasDisponibles'][u['year'] + '-' + u['month'] + '-' + u['day']].push(val)

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
    recurso['proximaFechaEpoch'] = recurso['proximaHoraDisponible']['cupo']['horaEpoch'];

    return recurso;

  }

  crearListaFechas() {

    const compensacion = -180;
    let fecha = new Date();
    let f;
    fecha.setDate(1);
    fecha.setMinutes(0);
    fecha.setSeconds(0);
    fecha.setHours(6);

    for (let day = 1; day <= 380; day++) {

      if (day == 1) {
        f = this.utils.toLocalScl(fecha, compensacion);
      } else {
        fecha.setDate(fecha.getDate() + 1);
        f = this.utils.toLocalScl(fecha, compensacion);
      }

      f = this.utils.toStringDateJson(f);
      this.listaFechas[f.year + '-' + f.month + '-' + f.day] = [];

    }

  }

  seleccionarHora(data) {
    this.horaSeleccionada = data;
    this.calendario.emit(data);
    gtag('event', 'Clic', { 'event_category': 'Reserva de Hora', 'event_label': 'Paso2:Selección-Hora' });
  }

  verPerfil(re) {
    this.utils.verPerfilProfesional(re);
  }

}