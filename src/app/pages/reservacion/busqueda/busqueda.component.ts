import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AgendaAmbulatoriaService } from  'src/app/services/agenda-ambulatoria.service';
import { FormControl } from '@angular/forms'
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UtilsService } from 'src/app/services/utils.service';
import { ActivatedRoute } from '@angular/router';

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
  public readQuery:boolean = false;

  public loadedProf:boolean = false;
  public loadedEsp: boolean = false;
  public loadedCen: boolean = false;

  @Output() public emitReadQuery:EventEmitter<boolean> = new EventEmitter();
  @Output() public emitBusqueda:EventEmitter<any> = new EventEmitter();

  constructor(
    public agendaService:AgendaAmbulatoriaService,
    public utils:UtilsService,
    public aRouter:ActivatedRoute
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
      
        this.setDataQueryParams().then( params => {
          let qp = params;
          this.areaSelected = {};

          res['areas'].forEach((val, key) => {
            if((val['nombre'].toLowerCase() == 'consultas' && !qp['area']) ||
               (qp['area'] && qp['area'] == val['id']) ){
              this.areaSelected = val;
            }
          })

          if(!this.areaSelected.id){
            res['areas'].forEach((val, key) => {
              if(val['nombre'].toLowerCase() == 'consultas'){
                this.areaSelected = val;
              }
            })
            this.emitterReadQuery(true)
          }

          this.clearSelection('profesional');

          if(qp['tipo'] && qp['tipo'] == 'profesional'){
            this.getProfesionales();
          }else{
            this.getEspecialidades('especialidad');
          }

        })
        
      }else{
        this.emitterReadQuery(true)
      }
    })
  }

  getProfesionales(){
    this.clearSelection('profesional')
    this.loadedProf = false;
    this.agendaService.getProfesionales(this.areaSelected['id']).subscribe( res => {
      
      this.setDataQueryParams().then( params => {

        let matchProfesional = null;
        let qp = params;

        if(res['profesionales'] && res['profesionales'].length > 0){
          res['profesionales'].forEach( (val, key)  => {
            res['profesionales'][key]['detalle'] = val['nombreProfesional'];

            if(qp['profesional'] == val['idProfesional']){
              matchProfesional = val;
            }
          })
  
          this.profesionales = res['profesionales'];

            if(matchProfesional){
              this.profesionalCtrl.patchValue(matchProfesional);
              this.profesionalSelection(matchProfesional);
              this.getEspecialidades('profesional');
            }else{
              this.emitterReadQuery(true)
            }

  
        }else{
          this.profesionales = [];
        }

        this.filterProfesionales = this.profesionalCtrl.valueChanges.pipe(
          startWith<string | any>(''),
          map(value => typeof value === 'string' ? value : value.detalle),
          map(nombreFiltro => nombreFiltro ? this.filterAutocomplete(nombreFiltro, 'profesionales') : this.profesionales.slice()),
        );

        this.tipoConsulta = 'profesional';
        this.loadedProf = true;

      });

     
    })
  }

  getEspecialidades(tipo:string){

    this.tipoConsulta = tipo;
    this.loadedEsp = false;

    let observer:any;
    if(tipo == 'profesional'){
      observer = this.agendaService.getEspecialidadesByProfesional(this.profesionalSelected['idProfesional'], this.areaSelected['id']);
    }else{
      
      observer = this.agendaService.getEspecialidadesByGeneric(this.areaSelected['id']);
      this.clearSelection('especialidad');

    }
      observer.subscribe( res => {

        this.setDataQueryParams().then( params => {

          let matEspecialidad = null;
          let qp = params;

          if(res['especialidadesPorServicio'] && res['especialidadesPorServicio'].length > 0){
            res['especialidadesPorServicio'].forEach( (val, key)  => {
              res['especialidadesPorServicio'][key]['detalle'] = val['nombreEspecialidad'] + " - " + val['nombreServicio'];

              if(qp['especialidad'] && qp['especialidad'] == val['idEspecialidad']){
                matEspecialidad = val;
              }
            })
  
            this.especialidades = res['especialidadesPorServicio'];
  
            if(matEspecialidad){
              this.especialidadCtrl.patchValue(matEspecialidad);
              this.especialidadSelection(matEspecialidad);
            }else{
              this.emitterReadQuery(true)
            }

          }else{
            this.especialidades = [];
            this.emitterReadQuery(true)
          }

          this.filterEspecialidades = this.especialidadCtrl.valueChanges.pipe(
            startWith<string | any>(''),
            map(value => typeof value === 'string' ? value : value.detalle),
            map(nombreFiltro => nombreFiltro ? this.filterAutocomplete(nombreFiltro, 'especialidades') : this.especialidades.slice()),
          );
          
          this.loadedEsp = true;
        })  

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
    this.clearSelection('profesional');
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
      this.centroAtencionCtrl.setValue('');
      this.especialidadCtrl.setValue('');
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
    let isProf = (this.profesionalSelected) ? this.profesionalSelected['idProfesional'] : null;
    this.loadedCen = false;

    this.agendaService.getCentrosByEspecialidad(this.especialidadCtrl.value.idServicio, this.areaSelected['id'], isProf).subscribe( res => {

      this.setDataQueryParams().then( params => {

        let matCentro = null;
        let qp = params;
        let region = (res['regiones'] && res['regiones'][0]) ? res['regiones'][0]['idRegion'] : null;
        if (res['centros'].length >= 2) {
          let objTodos = {
            direccion: { calle: null, numero: null, piso: null, comuna: 'Región Metropolitana' },
            horaApertura: null,
            horaCierre: null,
            idCentro: region,
            idRegion: null,
            latitud: null,
            longitud: null,
            nombre: "Todos",
            codigo: 'todos',
            detalle: 'Todos'
          }
          res['centros'].unshift(objTodos)
        }
        if(res['centros'] && res['centros'].length > 0){
          res['centros'].forEach( (val, key)  => {
            res['centros'][key]['detalle'] = val['nombre'] + ' - ' + val['direccion']['comuna'];
            if(qp['centro'] && qp['centro'] == val['idCentro']){
              matCentro = res['centros'][key];
            }
          })

          this.centrosAtencion = res['centros'];

            if(matCentro){
              this.centroAtencionCtrl.patchValue(matCentro);
              this.centroAtencionSelection(matCentro);
              this.buscarHora();
            }else{
              this.emitterReadQuery(true)
            }
        }else{
          this.centrosAtencion = [];
          this.readQuery = true;
        }

        this.filterCentrosAtencion = this.centroAtencionCtrl.valueChanges.pipe(
          startWith<string | any>(''),
          map(value => typeof value === 'string' ? value : value.detalle),
          map(nombreFiltro => nombreFiltro ? this.filterAutocomplete(nombreFiltro, 'centros') : this.centrosAtencion.slice()),
        );
        
        this.loadedCen = true;
      })
      
    })
    
  }

  profesionalSelection(event){
    this.profesionalCtrl.disable();
    this.profesionalSelected =  this.profesionalCtrl.value;
    this.getEspecialidades('profesional');
    console.log(this.profesionalSelected)

  }

  centroAtencionSelection(event) {
    this.centroAtencionCtrl.disable();
    console.log(this.profesionalSelected)
    this.centroAtencionSelected =  this.centroAtencionCtrl.value;
  }

  buscarHora(){

    this.emitBusqueda.emit({
      area: this.areaSelected,
      profesional : this.profesionalSelected,
      especialidad: this.especialidadSelected,
      centroAtencion: this.centroAtencionSelected
    })
    this.emitterReadQuery(true)
  }

  emitterReadQuery(status){
    this.readQuery = status;
    if(status){
      this.emitReadQuery.emit(status)
    }
  }

  async setDataQueryParams(){
    let p = {};
    await this.aRouter.queryParams.subscribe( params => {
      if(!this.readQuery){
        p = params;
      }
    })
    return p;
  }

  cambiarTipoBusqueda(tipo){

    this.clearSelection('profesional');

    if(tipo == 'especialidad'){
      this.getEspecialidades('especialidad')
    }

    if(tipo == 'profesional'){
      this.getProfesionales();
    }
  }
}
