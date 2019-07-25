import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AgendaAmbulatoriaService } from  'src/app/services/agenda-ambulatoria.service';
import { FormControl } from '@angular/forms'
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.scss']
})
export class BusquedaComponent implements OnInit {

  public areas:any = []
  public especialidades:any = [];
  public profesionales:any = [];
  public filterEspecialidades:Observable<any[]>;
  public filterCentrosAtencion:Observable<any[]>;
  public filterProfesionales:Observable<any[]>;;

  public centrosAtencion:any = [];
  public areaSelected:any;
  public profesionalSelected:any;
  public especialidadSelected:any;
  public centroAtencionSelected:any;
  public tipoConsulta:string = "especialidad";

  public profesionalCtrl = new FormControl();
  public especialidadCtrl = new FormControl();
  public centroAtencionCtrl = new FormControl();

  @Output() public emitBusqueda:EventEmitter<any> = new EventEmitter();

  constructor(
    public agendaService:AgendaAmbulatoriaService,
    public utils:UtilsService
  ) { }

  ngOnInit() {
    this.getAreas();

    this.utils.nuevaHora.subscribe( r => {
      this.clearSelection('profesional')
    })
  }

  getAreas(){
    this.agendaService.getAreas().subscribe( res => {

      if(res['areas'] && res['areas'].length > 0){
        this.areas = res['areas'];
        res['areas'].forEach((val, key) => {
            if(val['nombre'].toLowerCase() == 'consultas'){
              this.areaSelected = val;
            }
        })
        this.clearSelection('profesional');
        this.getEspecialidades('especialidad');
      }
    })
  }

  getProfesionales(){
    this.clearSelection('profesional')
    this.agendaService.getProfesionales(this.areaSelected['id']).subscribe( res => {

      if(res['profesionales'] && res['profesionales'].length > 0){
        res['profesionales'].forEach( (val, key)  => {
          res['profesionales'][key]['detalle'] = val['nombreProfesional'];
        })

        this.profesionales = res['profesionales'];
        this.filterProfesionales = this.profesionalCtrl.valueChanges.pipe(
            startWith<string | any>(''),
            map(value => typeof value === 'string' ? value : value.detalle),
            map(nombreFiltro => nombreFiltro ? this.filterAutocomplete(nombreFiltro, 'profesionales') : this.profesionales.slice()),
          );

      }
      this.tipoConsulta = 'profesional';
    })
  }

  getEspecialidades(tipo:string){

    this.tipoConsulta = tipo;
    let observer:any;
    if(tipo == 'profesional'){
      observer = this.agendaService.getEspecialidadesByProfesional(this.profesionalSelected['idProfesional']);
    }else{
      observer = this.agendaService.getEspecialidadesByGeneric(this.areaSelected['id']);
    }
      observer.subscribe( res => {

        if(res['especialidadesPorServicio'] && res['especialidadesPorServicio'].length > 0){
          res['especialidadesPorServicio'].forEach( (val, key)  => {
            res['especialidadesPorServicio'][key]['detalle'] = val['nombreEspecialidad'] + " - " + val['nombreServicio'];
          })

          this.especialidades = res['especialidadesPorServicio'];

          this.filterEspecialidades = this.especialidadCtrl.valueChanges.pipe(
              startWith<string | any>(''),
              map(value => typeof value === 'string' ? value : value.detalle),
              map(nombreFiltro => nombreFiltro ? this.filterAutocomplete(nombreFiltro, 'especialidades') : this.especialidades.slice()),
            );
        }else{
          this.especialidades = [];
        }

      })

  }

  filterAutocomplete(nombreFiltro: string, tipoAutoComplete:string): any[] {

    const filterValue = nombreFiltro.toLowerCase();
    switch(tipoAutoComplete){

      case 'profesionales':
        return this.profesionales.filter(option => {
          let detalle = option.detalle.toLowerCase();
          return ((detalle.indexOf(filterValue) >= 0))
        })
      break;

      case 'especialidades':
        return this.especialidades.filter(option => {
          let detalle = option.detalle.toLowerCase();
          return ((detalle.indexOf(filterValue) >= 0))
        })
      break;

      case 'centros':
        return this.centrosAtencion.filter(option => {
          let detalle = option.detalle.toLowerCase();
          return ((detalle.indexOf(filterValue) >= 0))
        })
      break;

      default:
        return [];
      break;
    }
  }

  displayTextAutocomplete(obj?: any): string | undefined {
    return obj ? obj.detalle : undefined;
  }

  changeAreas(event){
    this.areaSelected =  event.value;
    this.clearSelection('especialidad');
    this.getEspecialidades('especialidad');
  }

  clearSelection(tipo:string) {

    if(tipo == 'profesional'){
      this.profesionalCtrl.setValue('');
      this.especialidadCtrl.setValue('');
      this.centroAtencionCtrl.setValue('');
      this.profesionalCtrl.enable();
      this.especialidadCtrl.enable();
      this.centroAtencionCtrl.enable();
      this.profesionalSelected = null;
      this.especialidadSelected = null;
      this.centroAtencionSelected = null;
    }

    if(tipo == 'especialidad'){
      this.especialidadCtrl.setValue('');
      this.centroAtencionCtrl.setValue('');
      this.especialidadCtrl.enable();
      this.centroAtencionCtrl.enable();
      this.especialidadSelected = null;
      this.centroAtencionSelected = null;
    }

    if(tipo == 'centros'){
      this.centroAtencionCtrl.setValue('');
      this.centroAtencionCtrl.enable();
      this.centroAtencionSelected = null;
    }

    this.emitBusqueda.emit({
      area: null,
      profesional : null,
      especialidad: null,
      centroAtencion: null
    })
  }

  especialidadSelection(event) {
    this.especialidadCtrl.disable();
    this.especialidadSelected =  this.especialidadCtrl.value;
    this.centrosAtencion = [];
    this.agendaService.getCentrosByEspecialidad(this.especialidadCtrl.value.idServicio).subscribe( res => {
      if(res['centros'] && res['centros'].length > 0){
        res['centros'].forEach( (val, key)  => {
          res['centros'][key]['detalle'] = val['nombre'] + ' - ' + val['direccion']['comuna'];
        })
        if(res['centros'].length >= 2){
           res['centros'].unshift({idCentro: 0, nombre:'Todos', detalle: 'Todos'})
        }
        this.centrosAtencion = res['centros'];
        this.filterCentrosAtencion = this.centroAtencionCtrl.valueChanges.pipe(
            startWith<string | any>(''),
            map(value => typeof value === 'string' ? value : value.detalle),
            map(nombreFiltro => nombreFiltro ? this.filterAutocomplete(nombreFiltro, 'centros') : this.centrosAtencion.slice()),
          );
      }else{
        this.centrosAtencion = [];
      }
    })
  }

  profesionalSelection(event){
    this.profesionalCtrl.disable();
    this.profesionalSelected =  this.profesionalCtrl.value;
    this.getEspecialidades('profesional');
  }

  centroAtencionSelection(event) {
    this.centroAtencionCtrl.disable();
    this.centroAtencionSelected =  this.centroAtencionCtrl.value;
  }

  buscarHora(){
    this.emitBusqueda.emit({
      area: this.areaSelected,
      profesional : this.profesionalSelected,
      especialidad: this.especialidadSelected,
      centroAtencion: this.centroAtencionSelected
    })
  }

}
