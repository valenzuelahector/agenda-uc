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

@Component({
  selector: 'app-seleccion',
  templateUrl: './seleccion.component.html',
  styleUrls: ['./seleccion.component.scss']
})
export class SeleccionComponent implements OnInit, OnChanges {

  @Input() busquedaInicial: any;
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
  public enableScroll:boolean = false;
  public navigationDate = {
    min: null,
    max: null
  }
  constructor(
    public agendaService: AgendaAmbulatoriaService,
    public utils: UtilsService,
    public dialog: MatDialog,
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
    if(this.enableScroll){
      let wPos = window.scrollY;
      let dayWeekPos = this.getOffsetTop((<HTMLElement>document.getElementById('dayWeek')));
      this.dayWeekFixed = (wPos >= dayWeekPos) ? true : false
    }

  }

  ngOnChanges() {
    this.navigationDate = { min: null, max:null };
    this.counterLoader = 0;
    this.displayCalendar = true;

    let today = new Date();
    let min = today;
    let max = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    max.setHours(max.getHours() + 23);
    max.setMinutes(max.getMinutes() + 59)
    max.setSeconds(max.getSeconds() + 59)

    this.navigationDate['min'] = min;
    this.navigationDate['max'] = max;

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
    let today = new Date();
    let min = this.navigationDate['min']
    let newMin;
    let newMax;

    switch (action) {
      case 'next':
        this.contadorMeses++;
        min.setMonth(min.getMonth() + 1);
        newMin = new Date(min.getFullYear(), min.getMonth(), 1);
        newMax = new Date(min.getFullYear(), min.getMonth() + 1, 0);
        newMax.setHours(newMax.getHours() + 23);
        newMax.setMinutes(newMax.getMinutes() + 59)
        newMax.setSeconds(newMax.getSeconds() + 59)

        if (this.counterLoader < 3) {
          this.counterLoader++;
          if (this.busquedaInicial.profesional) {
            this.getRecursos(this.busquedaInicial.profesional.idProfesional, true);
          } else {
            this.getRecursos(null, true);
          }
        }else{
          this.utils.showProgressBar();
          setTimeout(() => {
            this.utils.hideProgressBar();
          }, 2000);
        }

        break;

      case 'prev':
        this.contadorMeses--;
        min.setMonth(min.getMonth() - 1);
        newMin = new Date(min.getFullYear(), min.getMonth(), (this.contadorMeses == 1) ? today.getDate() : 1);
        newMax = new Date(min.getFullYear(), min.getMonth() + 1, 0)
        newMax.setHours(newMax.getHours() + 23);
        newMax.setMinutes(newMax.getMinutes() + 59)
        newMax.setSeconds(newMax.getSeconds() + 59);

        this.utils.showProgressBar();
        setTimeout(() => {
          this.utils.hideProgressBar();
        }, 2000);

        break;
    }

    this.navigationDate['min'] = newMin;
    this.navigationDate['max'] = newMax;
    this.conciliarDateDisabled();
    this.determinarMesSinCupo()

    setTimeout(() => {
      this.displayCalendar = true;
    }, 500);

    this.goTop();

  }

  goTop(){

    let dayWeekPos = this.getOffsetTop((<HTMLElement>document.getElementById('dayWeek')));
    $("body, html").animate({
        scrollTop: dayWeekPos + "px"
    }, 500)
  }

  determinarMesSinCupo(){
    console.log(this.navigationDate)
    this.recursos.forEach((val, key) => {
      let posee = false;
      let listFechaDis = Object.keys(val['fechasDisponibles']);
      listFechaDis.forEach(k => {
        let fechaEvaluar = new Date(k + "T23:59:59");
        if(fechaEvaluar.getTime() >= this.navigationDate['min'].getTime() &&
            fechaEvaluar.getTime() <= this.navigationDate['max'].getTime()  &&
            val['fechasDisponibles'][k].length > 0
            ){
              posee = true;
        }
      })
      this.recursos[key]['poseeMes'] = posee;
    })
  }

  filtrarRecursosSoloProfesional(data){
    
    let recursos = [];
    if(data['listaRecursos']){
      data['listaRecursos'].forEach((val, key) => {
        if(val['tipoRecurso'].toLowerCase() != 'room'){
          recursos.push(val);
        }
      })
    }

    data['listaRecursos'] = recursos;
    return data;
  }

  getRecursos(idProfesional = null, next = false) {

    return new Promise((resolve, reject) => {

      this.fechaHoy = new Date();
      this.fechaLimite = new Date();
      this.fechaHoy.setDate(this.fechaHoy.getDate() + ( this.counterLoader * this.maxNumDays))
      this.fechaLimite.setDate(this.fechaHoy.getDate() + ( this.counterLoader * this.maxNumDays) + this.maxNumDays);
      this.fechaLimite = new Date(this.fechaLimite.getFullYear(), this.fechaLimite.getMonth() + 1, 0);
      this.fechaLimite.setHours(this.fechaLimite.getHours() + 23);
      this.fechaLimite.setMinutes(this.fechaLimite.getMinutes() + 59);
      this.fechaLimite.setSeconds(this.fechaLimite.getSeconds() + 59);

      if(this.counterLoader > 0){
          this.fechaHoy = new Date(this.fechaLimite.getFullYear(), this.fechaLimite.getMonth() - 2, 1);
      }


      this.agendaService.getRecursos({
        todosCentro: (this.busquedaInicial.centroAtencion.codigo == 'todos') ? true : false,
        idCentro: this.busquedaInicial.centroAtencion.idCentro,
        fechaInicio: this.utils.trDateStr(this.fechaHoy),
        fechaTermino: this.utils.trDateStr(this.fechaLimite),
        idServicio: this.busquedaInicial.especialidad.idServicio,
        idPlanSalud: ENV.idPlanSaludInit,
        idProfesional: idProfesional
      }).subscribe(data => {

        data = this.filtrarRecursosSoloProfesional(data);
        this.tiposCitas = data['listaTiposDeCita'];

        data['cuposProfesional'] = {};

        if (data['listaRecursos'] && data['listaRecursos'].length > 0) {

          data['listaCupos'].forEach((valCupo, keyCupo) => {
            if (!data['cuposProfesional'][valCupo['idRecurso']]) {
              data['cuposProfesional'][valCupo['idRecurso']] = [];
            }
            data['cuposProfesional'][valCupo['idRecurso']].push(valCupo);
          })

          data['listaRecursos'].forEach((val, key) => {
            data['listaRecursos'][key]['cupos'] = (data['cuposProfesional'][val['idCorto']]) ? data['cuposProfesional'][val['idCorto']] : [];
            data['listaRecursos'][key] = this.crearCalendario(data['listaRecursos'][key], data['listaCentros'], data['listaDisponibilidades'], data['listaRecursos'])
          })

          this.enableScroll = true;
          let listRe = this.orderPipe.transform(data['listaRecursos'], 'proximaFechaEpoch');
          this.conciliarDataRecursos(listRe, this.fechaHoy, this.fechaLimite);
        }

        this.enableScroll = true;
        this.loadedRecursos = true;

        setTimeout(()=> {
          this.utils.hideProgressBar();
        },3000)
        
        resolve(data);


      })
    })

  }
  
  conciliarDateDisabled(){

    this.recursos.forEach((val, key) => {
      let dateDisabled = this.recursos[key]['datesToHighlight']['dates'];
      this.recursos[key]['datesToHighlight']['dates'] = dateDisabled;
      this.recursos[key]['datesToHighlight']['dateClass'] = this.dateClass(dateDisabled);
    })
  }

  conciliarDataRecursos(recursosProcesados, desde, hasta): void {
    
    recursosProcesados.forEach((valRe, keyRe) => {
      console.log(valRe['datesToHighlight'])
      var foundInRe = false;
      this.recursos.forEach((valRee, keyRee) => {
        if (valRe['id'] == valRee['id']) {
          foundInRe = true;
          this.recursos[keyRee]['cupos'] = valRee['cupos'].concat(valRe['cupos'])
          Object.keys(valRe['fechasDisponibles']).forEach(keyr => {
            let fechaEvaluar = new Date(keyr)
            if(fechaEvaluar.getTime() >= desde.getTime() && fechaEvaluar.getTime() <= hasta.getTime()){
              this.recursos[keyRee]['fechasDisponibles'][keyr] = valRe['fechasDisponibles'][keyr];
            }
          })

          this.recursos[keyRee]['datesToHighlight']['dates'] = [];
          let dateDisabled = [];
          Object.keys(this.recursos[keyRee]['fechasDisponibles']).forEach( key => {
              let itm = this.recursos[keyRee]['fechasDisponibles'];
              if(itm[key].length == 0){
                dateDisabled.push(key + "T12:00:00.000Z")
              }
          })

          this.recursos[keyRee]['datesToHighlight']['dates'] = dateDisabled;
          this.recursos[keyRee]['datesToHighlight']['dateClass'] = this.dateClass(dateDisabled);
        }
      })

      if (!foundInRe) {
        valRe['disponibleDesde'] = desde;
        valRe['disponibleHasta'] = hasta;
        this.recursos.push(valRe)
      }

      this.determinarMesSinCupo();

    })
  }

  dateClass(datesDs) {
    return (date: Date): MatCalendarCellCssClasses => {
      let datesDisabled = JSON.parse(JSON.stringify(datesDs))
      const highlightDate = datesDisabled
        .map(strDate => new Date(strDate))
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
        agrupCentros[val['idCentro']] = { 'nombreCentro': val['nombreCentro'], cupos: [], habilitado: false }
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

  crearCalendario(dataRecurso: any, centros: any, disponibilidades: any, recursos: any) {

    let fecha = new Date();
    let f = null;

    dataRecurso['fechasDisponibles'] = {};
    dataRecurso['listaCentrosIdCorto'] = {};
    dataRecurso['listaDisponibilidadesIdCorto'] = {};
    dataRecurso['listaRecursosIdCorto'] = {};


    centros.forEach((val, key) => {
      dataRecurso['listaCentrosIdCorto'][val['idCorto']] = val;
    })

    disponibilidades.forEach((val, key) => {
      dataRecurso['listaDisponibilidadesIdCorto'][val['idCorto']] = val;
    })

    recursos.forEach((val, key) => {
      dataRecurso['listaRecursosIdCorto'][val['idCorto']] = val;
    })

    for (let day = 0; day <= 400; day++) {

      if (day == 0) {
        f = this.utils.trDateStr(fecha, 'json');
      } else {
        fecha.setDate(fecha.getDate() + 1);
        f = this.utils.trDateStr(fecha, 'json');
      }

      dataRecurso['fechasDisponibles'][f.year + '-' + f.month + '-' + f.day] = [];
      dataRecurso['cupos'].forEach((val, key) => {

        let fechaEpoch = new Date(val['horaEpoch'] * 1000);
        let u = this.utils.trDateStr(fechaEpoch, 'json');

        val['idTipoCita'] = this.getTipoCita(val['tiposDeCita'][0]);
        val['fechaHora'] = fechaEpoch;
        val['nombreCentro'] = (dataRecurso['listaCentrosIdCorto'][val['idCentro']]) ? dataRecurso['listaCentrosIdCorto'][val['idCentro']]['nombre'] : 'S/I';
        val['idStrCentro'] = (dataRecurso['listaCentrosIdCorto'][val['idCentro']]) ? dataRecurso['listaCentrosIdCorto'][val['idCentro']]['id'] : null;
        val['idStrDisponibilidad'] = (dataRecurso['listaDisponibilidadesIdCorto'][val['idDisponibilidad']]) ? dataRecurso['listaDisponibilidadesIdCorto'][val['idDisponibilidad']]['id'] : null;
        val['idStrRecProfesional'] = (dataRecurso['listaRecursosIdCorto'][val['idRecurso']]) ? dataRecurso['listaRecursosIdCorto'][val['idRecurso']]['id'] : null;

        if (f['year'] == u['year'] && f['month'] == u['month'] && f['day'] == u['day']) {
          dataRecurso['fechasDisponibles'][f.year + '-' + f.month + '-' + f.day].push(val)
        }

      })
    }

    dataRecurso['datesToHighlight'] = { dates: [], displayed: false, dateClass: null };
    let proximaFecha: boolean = false;
    let datesDisabled = [];

    Object.keys(dataRecurso['fechasDisponibles']).forEach(key => {
      if (dataRecurso['fechasDisponibles'][key].length == 0) {
        datesDisabled.push(key + 'T12:00:00.000Z');
      } else if (!proximaFecha) {
        let count = 0;
        dataRecurso['fechasDisponibles'][key].forEach((valDx, keyDx) => {
          if (count == 0) {
            dataRecurso['proximaFecha'] = new Date(valDx['horaEpoch'] * 1000);
            dataRecurso['proximaFechaEpoch'] = valDx['horaEpoch'];
            proximaFecha = true;
          }
          count++;
        });
      }
    })

    dataRecurso['datesToHighlight']['displayed'] = true;
    dataRecurso['datesToHighlight']['dates'] = datesDisabled;
    dataRecurso['datesToHighlight']['dateClass'] = this.dateClass(datesDisabled);

    return dataRecurso;
  }

  seleccionarHora(data) {
    this.calendario.emit(data);
    gtag('event', 'Clic', { 'event_category': 'Reserva de Hora', 'event_label': 'Paso2:Selección-Hora' });
  }

  verPerfil(re) {
    this.agendaService.getDatosProfesional(re.id).subscribe(data => {
      if (data && data['statusCod'] && data['statusCod'] == 'OK') {
        let dialogRef = this.dialog.open(PerfilProfesionalComponent, {
          width: '840px',
          data: { profesionalData: data['datosProfesional'] }
        });
      } else {
        this.utils.mDialog("Error", "No se puede mostrar el perfil. Intente más tarde", "error");
      }

    })
  }

  getTipoCita(idCorto) {

    let res = null;
    this.tiposCitas.forEach((val, key) => {
      if (val['idCorto'] == idCorto) {
        res = val;
      }
    })

    return res;
  }
}
