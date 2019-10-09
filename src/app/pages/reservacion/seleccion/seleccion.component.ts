import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ViewChild } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { AgendaAmbulatoriaService } from 'src/app/services/agenda-ambulatoria.service';
import { MatCalendarCellCssClasses } from '@angular/material';
import { PerfilProfesionalComponent } from 'src/app/shared/components/modals/perfil-profesional/perfil-profesional.component';
import { MatDialog } from '@angular/material';
import { OrderPipe } from 'ngx-order-pipe';
import { ENV } from 'src/environments/environment';

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

  constructor(
    public agendaService: AgendaAmbulatoriaService,
    public utils: UtilsService,
    public dialog: MatDialog,
    public orderPipe: OrderPipe
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {
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
  }

  getRecursos(idProfesional = null, index = 0) {

    return new Promise((resolve, reject) => {
      this.fechaHoy = new Date();
      this.fechaLimite = new Date();
      this.fechaLimite.setDate(this.fechaHoy.getDate() + 90);
      this.agendaService.getRecursos({
        todosCentro: (this.busquedaInicial.centroAtencion.codigo == 'todos') ? true : false,
        idCentro: this.busquedaInicial.centroAtencion.idCentro,
        fechaInicio: this.utils.trDateStr(this.fechaHoy),
        fechaTermino: this.utils.trDateStr(this.fechaLimite),
        idServicio: this.busquedaInicial.especialidad.idServicio,
        idPlanSalud: ENV.idPlanSaludInit,
        idProfesional: idProfesional
      }).subscribe(data => {

        this.recursos = [];
        this.tiposCitas = data['listaTiposDeCita'];

        data['cuposProfesional'] = {};

        if (data['listaRecursos']) {

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


          this.recursos = this.orderPipe.transform(data['listaRecursos'], 'proximaFechaEpoch') ;
        } else {
          this.recursos = [];
        }
        this.loadedRecursos = true;
        resolve(data);
      })
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

    for (let day = 0; day <= this.maxNumDays; day++) {

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

    dataRecurso['datesToHighlight']['dates'] = datesDisabled;
    dataRecurso['datesToHighlight']['dateClass'] = this.dateClass(datesDisabled);
    dataRecurso['datesToHighlight']['displayed'] = true;

    return dataRecurso;
  }

  seleccionarHora(data) {
    this.calendario.emit(data);
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
