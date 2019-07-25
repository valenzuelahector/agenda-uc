import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ViewChild } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { AgendaAmbulatoriaService } from  'src/app/services/agenda-ambulatoria.service';
import { MatCalendarCellCssClasses } from '@angular/material';
import { PerfilProfesionalComponent } from 'src/app/shared/components/modals/perfil-profesional/perfil-profesional.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-seleccion',
  templateUrl: './seleccion.component.html',
  styleUrls: ['./seleccion.component.scss']
})
export class SeleccionComponent implements OnInit, OnChanges {

  @Input() busquedaInicial:any;
  @Output() calendario:EventEmitter<any> = new EventEmitter();

  public recursos:any;
  public fechaHoy:Date;
  public fechaLimite:Date;
  public datesToHighlight:any = {}
  public selectedDate:any = {};
  public maxNumDays:number = 90;
  public centrosProfesional:any = {};
  public loadedRecursos:boolean = false;

  constructor(
    public agendaService:AgendaAmbulatoriaService,
    public utils:UtilsService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  ngOnChanges(){
    if(this.busquedaInicial && this.busquedaInicial.especialidad){
      this.getRecursos();
    }else{
      this.datesToHighlight = {};
      this.selectedDate = {};
      this.recursos = [];
      this.centrosProfesional = {};
      this.loadedRecursos = false;
    }
  }

  getRecursos(idProfesional = null, index = 0){
    return new Promise((resolve, reject ) => {
      this.fechaHoy = new Date();
      this.fechaLimite = new Date();
      this.fechaLimite.setDate(this.fechaHoy.getDate() + 90);

      this.agendaService.getRecursos({
        idCentro: this.busquedaInicial.centroAtencion.idCentro,
        fechaInicio: this.utils.trDateStr(this.fechaHoy),
        fechaTermino:this.utils.trDateStr(this.fechaLimite),
        idServicio: this.busquedaInicial.especialidad.idServicio,
        idPlanSalud: '4c30555e-5ed3-418f-8f54-a91a00ace99b',
        idProfesional: idProfesional
      }).subscribe( data => {

        this.recursos = [];

        if(idProfesional){
            this.recursos[index]['cupos'] =  (data['listaCupos']) ? data['listaCupos'] : [];
        }else{
          data['cuposProfesional'] = {};

          if(data['listaRecursos']){

            data['listaCupos'].forEach((valCupo, keyCupo) => {
              if(!data['cuposProfesional'][valCupo['idRecurso']]){
                data['cuposProfesional'][valCupo['idRecurso']] = [];
              }
              data['cuposProfesional'][valCupo['idRecurso']].push(valCupo);
            })

            data['listaRecursos'].forEach((val, key) => {
              data['listaRecursos'][key]['cupos'] = (data['cuposProfesional'][val['idCorto']]) ? data['cuposProfesional'][val['idCorto']] : [];
              data['listaRecursos'][key] = this.crearCalendario(data['listaRecursos'][key], data['listaCentros'], data['listaDisponibilidades'])
            })
            console.log(data['listaRecursos']);
            this.recursos = data['listaRecursos'];
          }else{
            this.recursos = [];
          }
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


  onSelect(event, i){
    this.selectedDate[i] = event;
    let fechaDisSel = this.utils.trDateStr(event, 'json');
    let idxFecha = fechaDisSel['year'] + "-" + fechaDisSel['month'] + '-' + fechaDisSel['day'];
    let centrosProfesionales = this.recursos[i]['fechasDisponibles'][idxFecha];
    let agrupCentros:any = {};
  //  this.centrosProfesional[i] = this.recursos[i]['fechasDisponibles'][idxFecha];
    centrosProfesionales.forEach((val, key) => {
      if(!agrupCentros[val['idCentro']]){
        agrupCentros[val['idCentro']] = {'nombreCentro' : val['nombreCentro'], cupos: [], habilitado: false}
      }
      agrupCentros[val['idCentro']]['cupos'].push(val)
    })
    this.centrosProfesional[i] = [];
    Object.keys(agrupCentros).forEach(key => {
      this.centrosProfesional[i].push(agrupCentros[key]);
    })
  }
/*
  cargarCalendario(re, i){

    this.getRecursos(re.id, i).then((dataRecurso)=> {

      let fecha = new Date();
      let f = null;

      this.recursos[i]['fechasDisponibles'] = {};
      this.recursos[i]['listaCentrosIdCorto'] = {};
      dataRecurso['listaCentros'].forEach((val, key) => {
        this.recursos[i]['listaCentrosIdCorto'][val['idCorto']] = val;
      })

      for(let day = 1; day <= this.maxNumDays; day++){

        if(day == 1){
           f = this.utils.trDateStr(fecha, 'json');
        }else{
          fecha.setDate( fecha.getDate() + 1);
           f = this.utils.trDateStr(fecha, 'json');
        }
        this.recursos[i]['fechasDisponibles'][f.year + '-' + f.month + '-' + f.day] = [];
        this.recursos[i]['cupos'].forEach((val, key) => {
          let fechaEpoch = new Date(val['horaEpoch']*1000);
          let u = this.utils.trDateStr(fechaEpoch, 'json');
          val['fechaHora'] = fechaEpoch;
          val['nombreCentro'] = (this.recursos[i]['listaCentrosIdCorto'][val['idCentro']]) ? this.recursos[i]['listaCentrosIdCorto'][val['idCentro']]['nombre'] : 'S/I';
          if(f['year'] == u['year'] && f['month'] == u['month'] && f['day'] == u['day']){
            this.recursos[i]['fechasDisponibles'][f.year + '-' + f.month + '-' + f.day].push(val)
          }
        })
      }
      console.log(this.recursos[i]['fechasDisponibles']);
      this.datesToHighlight[i] = { dates:[], displayed: false, dateClass: null };
      let proximaFecha:boolean = false;
      let datesDisabled = [];

      Object.keys(this.recursos[i]['fechasDisponibles']).forEach(key => {
        if(this.recursos[i]['fechasDisponibles'][key].length == 0){
          datesDisabled.push(key + 'T12:00:00.000Z');
        }else if(!proximaFecha){
          let count = 0;
          this.recursos[i]['fechasDisponibles'][key].forEach((valDx, keyDx) => {
              if(count == 0){
                this.recursos[i]['proximaFecha'] = new Date(valDx['horaEpoch']*1000);
                proximaFecha = true;
              }
              count++;
          });
        }
      })

      this.datesToHighlight[i]['dates'] = datesDisabled;
      this.datesToHighlight[i]['dateClass'] = this.dateClass(datesDisabled);
      this.datesToHighlight[i]['displayed'] = true;
    })
  }
*/
  crearCalendario(dataRecurso:any, centros:any, disponibilidades:any){

      let fecha = new Date();
      let f = null;

      dataRecurso['fechasDisponibles'] = {};
      dataRecurso['listaCentrosIdCorto'] = {};
      dataRecurso['listaDisponibilidadesIdCorto'] = {};

      centros.forEach((val, key) => {
        dataRecurso['listaCentrosIdCorto'][val['idCorto']] = val;
      })

      disponibilidades.forEach((val, key) => {
        dataRecurso['listaDisponibilidadesIdCorto'][val['idCorto']] = val;
      })

      for(let day = 1; day <= this.maxNumDays; day++){

        if(day == 1){
           f = this.utils.trDateStr(fecha, 'json');
        }else{
          fecha.setDate( fecha.getDate() + 1);
           f = this.utils.trDateStr(fecha, 'json');
        }
        dataRecurso['fechasDisponibles'][f.year + '-' + f.month + '-' + f.day] = [];
        dataRecurso['cupos'].forEach((val, key) => {
          let fechaEpoch = new Date(val['horaEpoch']*1000);
          let u = this.utils.trDateStr(fechaEpoch, 'json');
          val['fechaHora'] = fechaEpoch;
          val['nombreCentro'] = (dataRecurso['listaCentrosIdCorto'][val['idCentro']]) ? dataRecurso['listaCentrosIdCorto'][val['idCentro']]['nombre'] : 'S/I';
          val['idStrCentro'] = (dataRecurso['listaCentrosIdCorto'][val['idCentro']]) ? dataRecurso['listaCentrosIdCorto'][val['idCentro']]['id'] : null;
          val['idStrDisponibilidad'] = (dataRecurso['listaDisponibilidadesIdCorto'][val['idDisponibilidad']]) ? dataRecurso['listaDisponibilidadesIdCorto'][val['idDisponibilidad']]['id'] : null;
          if(f['year'] == u['year'] && f['month'] == u['month'] && f['day'] == u['day']){
            dataRecurso['fechasDisponibles'][f.year + '-' + f.month + '-' + f.day].push(val)
          }
        })
      }
      dataRecurso['datesToHighlight'] = { dates:[], displayed: false, dateClass: null };
      let proximaFecha:boolean = false;
      let datesDisabled = [];

      Object.keys(dataRecurso['fechasDisponibles']).forEach(key => {
        if(dataRecurso['fechasDisponibles'][key].length == 0){
          datesDisabled.push(key + 'T12:00:00.000Z');
        }else if(!proximaFecha){
          let count = 0;
          dataRecurso['fechasDisponibles'][key].forEach((valDx, keyDx) => {
              if(count == 0){
                dataRecurso['proximaFecha'] = new Date(valDx['horaEpoch']*1000);
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

  seleccionarHora(data){
    console.log(data);
    this.calendario.emit(data);
  }

  verPerfil(re){
    this.agendaService.getDatosProfesional(re.id).subscribe( data => {
      if(data && data['statusCod'] && data['statusCod'] == 'OK'){
        let dialogRef = this.dialog.open(PerfilProfesionalComponent, {
          width:'840px',
          data: {profesionalData: data['datosProfesional'] }
        });
      }else{
        this.utils.mDialog("Error", "No se puede mostrar el perfil. Intente más tarde", "error");
      }

    })

  }
}
