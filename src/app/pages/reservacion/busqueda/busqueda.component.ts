import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { AgendaAmbulatoriaService } from 'src/app/services/agenda-ambulatoria.service';
import { FormControl } from '@angular/forms'
import { map, startWith, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { Observable, Observer } from 'rxjs';
import { UtilsService } from 'src/app/services/utils.service';
import { ActivatedRoute } from '@angular/router';
import { OrderPipe } from 'ngx-order-pipe';
import { ENV } from 'src/environments/environment';
import gtag, { install } from 'ga-gtag';

//install('UA-143119471-2');

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.scss']
})
export class BusquedaComponent implements OnInit {

  public areas: any = []
  public especialidades: any = [];
  public realEspecialidades:any = [];
  public profesionales: any = [];
  public servicios:any = [];


  public filterEspecialidades: Observable<any[]>;
  public filterCentrosAtencion: Observable<any[]>;
  public filterProfesionales: Observable<any[]>;;
  public filterServicios: Observable<any[]>;;

  public centrosAtencion: any = [];
  public areaSelected: any;
  public profesionalSelected: any;
  public especialidadSelected: any;
  public centroAtencionSelected: any;
  public servicioSelected:any;

  public tipoConsulta: string = "especialidad";

  public profesionalCtrl = new FormControl();
  public especialidadCtrl = new FormControl();
  public centroAtencionCtrl = new FormControl();
  public servicioCtrl = new FormControl();

  public readQuery: boolean = false;

  public loadedProf: boolean = false;
  public loadedEsp: boolean = false;
  public loadedCen: boolean = false;
  public loadedServ: boolean = false;

  public loadingEspecialidades: boolean = false;
  public loadingProfesionales: boolean = false;

  public loadedByUrlEspecialidades: boolean = false;
  public loadedByUrlProfesionales: boolean = false;

  public needLoadInitEspecialidades:boolean = false;
  public needLoadInitProfesionales:boolean = false;

  @Output() public emitReadQuery: EventEmitter<boolean> = new EventEmitter();
  @Output() public emitBusqueda: EventEmitter<any> = new EventEmitter();

  constructor(
    public agendaService: AgendaAmbulatoriaService,
    public utils: UtilsService,
    public aRouter: ActivatedRoute,
    public orderPipe: OrderPipe
  ) { }

  ngOnInit() {
    this.getAreas();

    this.utils.nuevaHora.subscribe(r => {
      this.clearSelection('profesional')
    })
  }

  getParamsArea(){
    return new Promise((resolve, reject) => {
      this.aRouter.params.subscribe( params => {
        resolve(params)
      })
    })
  }

  getAreas() {
    this.agendaService.getAreas().subscribe(res => {

      if (res['areas'] && res['areas'].length > 0) {
        this.areas = res['areas'];

        this.setDataQueryParams().then(async params => {
          let qp = params;
          this.areaSelected = {};
          let paramArea = await this.getParamsArea();

          res['areas'].forEach((val, key) => {
            let setParamArea = false;
            if(paramArea && paramArea['area'] && this.utils.slugify(val['nombre'], "-") === this.utils.slugify(paramArea['area'], "-")){
                this.areaSelected = val;
                setParamArea = true;
            }

            if ( 
                (
                  (val['nombre'].toLowerCase() == 'consultas' && !qp['area']) || 
                  (qp['area'] && qp['area'].toLowerCase() == val['id'].toLowerCase())
                ) && !setParamArea 
              ) {
                this.areaSelected = val;
              }

          })

          if (!this.areaSelected.id) {
            res['areas'].forEach((val, key) => {
              if (val['nombre'].toLowerCase() == 'consultas') {
                this.areaSelected = val;
              }
            })
            this.emitterReadQuery(true)
          }

          this.clearSelection('profesional');

          if (qp['tipo'] && qp['tipo'].toLowerCase() == 'profesional') {
            this.getProfesionales();
          } else {
            this.getEspecialidades('especialidad');
          }

        })

      } else {
        this.emitterReadQuery(true)
      }
    })
  }

  getProfesionales() {

    this.setDataQueryParams().then(params => {

      let qp = params;

      this.tipoConsulta = 'profesional';
      this.loadedProf = false;

      let idProfesional = (!this.loadedByUrlProfesionales) ? qp['profesional'] : null;
      this.loadedByUrlProfesionales = true;

      if(idProfesional){
        this.needLoadInitProfesionales = true;
      }
      this.utils.showProgressBar();

      this.agendaService.getProfesionales(this.areaSelected['id'], null, idProfesional).subscribe(res => {

        this.clearSelection('profesional')

        this.profesionalCtrl.reset();

        let matchProfesional = null;

        if (res['profesionales'] && res['profesionales'].length > 0) {
          res['profesionales'].forEach((val, key) => {

            res['profesionales'][key]['detalle'] = val['nombreProfesional'];
            if (qp['profesional'] && qp['profesional'].toLowerCase() == val['idProfesional'].toLowerCase()) {
              matchProfesional = val;
            }
          })

          this.profesionales = this.orderPipe.transform(res['profesionales'], 'detalle');
          //this.filterProfesionales = this.orderPipe.transform(res['profesionales'], 'detalle');

          if (matchProfesional) {
            this.profesionalCtrl.patchValue(matchProfesional);
            this.profesionalSelection(matchProfesional);
          } else {
            this.emitterReadQuery(true)
          }

        } else {
          this.profesionales = [];
        }

        this.profesionalCtrl.valueChanges.pipe(
          debounceTime(500),
          tap(() => {
            this.loadingProfesionales = true;
          }),
          switchMap(value => {

            if (!value || value['idProfesional'] || value == "" || value.length < 3) {
              return Observable.create((observer: Observer<any>) => {
                if (value == "" || value.length < 3) {
                  observer.next([]);
                } else {
                  observer.next([])
                }
                observer.complete();
              });
            }
            return this.agendaService.getProfesionales(this.areaSelected['id'], value)
          })
        )
          .subscribe(data => {
            if (data['profesionales']) {
              data['profesionales'].forEach((val, key) => {
                data['profesionales'][key]['detalle'] = val['nombreProfesional'];
              })
              this.filterProfesionales = data['profesionales'];
            } else {
              this.filterProfesionales = null;
            }
            this.loadingProfesionales = false;

          }, () => {
            this.loadingProfesionales = false;
          });

        this.loadedProf = true;


      })

    })


  }

  distinctEspecialidades(data){

    let servicios = {};
    let especialidades = {};

    if(data['especialidadesPorServicio'] && data['especialidadesPorServicio'].length > 0){
      data['especialidadesPorServicio'].forEach((val, key) => {
        if(!servicios[val['idEspecialidad']]){
          servicios[val['idEspecialidad']] = [];
        }
        servicios[val['idEspecialidad']].push({ nombreServicio: val['nombreServicio'], idServicio : val['idServicio'], detalle: val['nombreServicio'],  nombreEspecialidad: val['nombreEspecialidad'], });
        especialidades[val['idEspecialidad']] = { nombreEspecialidad: val['nombreEspecialidad'], idEspecialidad: val['idEspecialidad'], servicios: []};
      }) 
  
      Object.keys(especialidades).forEach((val, key) => {
        Object.keys(servicios).forEach((valS, keyS) => {
          if(val == valS){
            especialidades[valS]['servicios'] = servicios[valS]
          }
        })
      })

      data['especialidadesPorServicio'] = [];

      Object.keys(especialidades).forEach((val, key) => {
        data['especialidadesPorServicio'].push(especialidades[val]);
      })

    }

    return data;
  }

  getEspecialidades(tipo: string) {

    this.setDataQueryParams().then(params => {
      let qp = params;

      this.tipoConsulta = tipo;
      this.loadedEsp = false;

      let observer: any;
      if (tipo == 'profesional') {
        observer = this.agendaService.getEspecialidadesByProfesional(this.profesionalSelected['idProfesional'], this.areaSelected['id']);
      } else {

        let idServicio = null;

        if(!this.loadedByUrlEspecialidades){
          idServicio = (this.tipoConsulta == 'especialidad') ? qp['servicio'] : qp['especialidad'];
        }
        
        if(idServicio){
          this.needLoadInitEspecialidades = true;
        }
        observer = this.agendaService.getEspecialidadesByGeneric(this.areaSelected['id'], null, idServicio);
        this.clearSelection('especialidad');

      }

      this.loadedByUrlEspecialidades = true;
      this.loadingEspecialidades = true;

      observer.subscribe(res => {

        this.especialidadCtrl.reset();
        let matEspecialidad = null;
        if(tipo == 'especialidad'){
          res = this.distinctEspecialidades(res);
        }

        if (res['especialidadesPorServicio'] && res['especialidadesPorServicio'].length > 0) {
          res['especialidadesPorServicio'].forEach((val, key) => {

            if(tipo == 'especialidad'){
              res['especialidadesPorServicio'][key]['detalle'] = val['nombreEspecialidad'];
            }else{
              res['especialidadesPorServicio'][key]['detalle'] = val['nombreEspecialidad'] + " - " + val['nombreServicio'];
            }

            if ((tipo == 'profesional' && qp['especialidad'] && qp['especialidad'].toLowerCase() == val['idServicio'].toLowerCase()) ||
                (tipo == 'especialidad' && qp['especialidad'] && qp['especialidad'].toLowerCase() == val['idEspecialidad'].toLowerCase())) {
                 matEspecialidad = val;
            }
          })

          this.especialidades = res['especialidadesPorServicio'];
          this.filterEspecialidades = res['especialidadesPorServicio'];

          if (matEspecialidad) {
            this.especialidadCtrl.patchValue(matEspecialidad);
            this.especialidadSelection(matEspecialidad, tipo);
          } else {

            if(tipo == 'profesional'){
              if(res['especialidadesPorServicio'].length == 1){
                this.especialidadCtrl.patchValue(res['especialidadesPorServicio'][0]);
                this.especialidadSelection(res['especialidadesPorServicio'][0]);
              }
            }
            
            this.emitterReadQuery(true)
          }


        } else {
          this.especialidades = [];
          this.emitterReadQuery(true)
        }

        this.especialidadCtrl.valueChanges.pipe(
          debounceTime(500),
          tap(() => {
            this.loadingEspecialidades = true;
          }),
          switchMap(value => {

            if (!value || value['idEspecialidad'] || value == "" || value.length < 3) {
              return Observable.create((observer: Observer<any>) => {
                if (value == "" || value.length < 3) {
                  observer.next({ especialidadesPorServicio: this.especialidades, noHttp: true });
                } else {
                  observer.next([])
                }
                observer.complete();
              });
            }
            if (tipo == 'profesional') {
              return this.agendaService.getEspecialidadesByProfesional(this.profesionalSelected['idProfesional'], this.areaSelected['id'], value);
            } else {
              return this.agendaService.getEspecialidadesByGeneric(this.areaSelected['id'], value);
            }
          })
        )
          .subscribe(data => {

            if(this.tipoConsulta == 'especialidad' && !data['noHttp']){
              data = this.distinctEspecialidades(data);
            }

            if (data['especialidadesPorServicio']) {

              data['especialidadesPorServicio'].forEach((val, key) => {
                if(this.tipoConsulta == 'especialidad'){
                  data['especialidadesPorServicio'][key]['detalle'] = val['nombreEspecialidad'];
                }else{
                  data['especialidadesPorServicio'][key]['detalle'] = val['nombreEspecialidad'] + " - " + val['nombreServicio'];
                }
              })
              this.filterEspecialidades = data['especialidadesPorServicio'];
            } else {
              this.filterEspecialidades = null;
            }
            this.loadingEspecialidades = false;

          }, () => {
            this.loadingEspecialidades = false;
          });

        this.loadedEsp = true;
        this.loadingEspecialidades = false;

      }, () => {
        this.loadingEspecialidades = false;
      })

    })
  }

  filterAutocomplete(nombreFiltro: string, tipoAutoComplete: string): any[] {

    const filterValue = nombreFiltro.toLowerCase();
    switch (tipoAutoComplete) {

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
      
      case 'servicios':
        return this.servicios.filter(option => {
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

  changeAreas(event) {
    this.areaSelected = event.value;
    this.clearSelection('profesional');
    this.getEspecialidades('especialidad');
  }

  clearSelection(tipo: string, fromForm:boolean = false) {

    if (tipo == 'profesional') {
      this.profesionalCtrl.setValue('');
      this.especialidadCtrl.setValue('');
      this.centroAtencionCtrl.setValue('');
      this.servicioCtrl.setValue('');
      this.profesionalCtrl.enable();
      this.especialidadCtrl.enable();
      this.servicioCtrl.enable();
      this.centroAtencionCtrl.enable();
      this.profesionalSelected = null;
      this.especialidadSelected = null;
      this.servicioSelected = null;
      this.centroAtencionSelected = null;

      if(this.needLoadInitProfesionales && fromForm){
        this.getProfesionales();
        this.needLoadInitProfesionales = false;
      }

    }

    if (tipo == 'especialidad') {
      this.centroAtencionCtrl.setValue('');
      this.servicioCtrl.setValue('');
      this.especialidadCtrl.setValue('');
      this.especialidadCtrl.enable();
      this.servicioCtrl.enable();
      this.centroAtencionCtrl.enable();
      this.especialidadSelected = null;
      this.servicioSelected = null;
      this.centroAtencionSelected = null;
      this.filterEspecialidades = this.especialidades;

      if(this.needLoadInitEspecialidades && fromForm){
        console.log("carga")
        this.getEspecialidades('especialidad');
        this.needLoadInitEspecialidades = false;
      }
    }

    if (tipo == 'servicio') {
      this.servicioCtrl.setValue('');
      this.servicioCtrl.enable();
      this.servicioSelected = null;
    }

    if (tipo == 'centros') {
      this.centroAtencionCtrl.setValue('');
      this.centroAtencionCtrl.enable();
      this.centroAtencionSelected = null;
    }

    this.emitBusqueda.emit({
      area: null,
      profesional: null,
      especialidad: null,
      centroAtencion: null
    })
  }

  priorizarCentro(data){

    let centroPrioritario = ENV.idCentroPrioritario;
    let centros = [];
    let centroTodos = null;
    for(let centro of data){
      if(centro['codigo'] !== 'todos'){
        if(centroPrioritario === centro['idCentro']){
          centros.unshift(centro);
        }else{
          centros.push(centro);
        }
      }else{
        centroTodos = centro;
      }
    }

    if(data.length >= 2 ){
      centros.push(centroTodos);
    }

    return centros;
  }     

  getCentros(idServicio){

    let isProf = (this.profesionalSelected) ? this.profesionalSelected['idProfesional'] : null;
    this.centrosAtencion = [];
    this.loadedCen = false;
    this.agendaService.getCentrosByEspecialidad(idServicio, this.areaSelected['id'], isProf).subscribe(res => {

      this.setDataQueryParams().then(params => {

        let matCentro = null;
        let qp = params;
        let region = (res['regiones'] && res['regiones'][0]) ? res['regiones'][0]['idRegion'] : null;

        res['centros'].forEach((val, key) => {
          ENV.idCentrosNoDisponibles.forEach((v, k) => {
            if(val['idCentro'] == v){
              res['centros'].splice(key, 1);
            }
          })
        })
        
        let objTodos:any;

        if (res['centros'].length >= 2 || this.utils.slugify(this.areaSelected.nombre, "-") === 'telemedicina' || this.utils.slugify(this.areaSelected.nombre, "-") === 'consulta-medica-virtual') {
          objTodos = {
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

          res['centros'].unshift(objTodos);

        }

        if (res['centros'] && res['centros'].length > 0) {
          res['centros'].forEach((val, key) => {
            res['centros'][key]['detalle'] = val['nombre'] + ' - ' + val['direccion']['comuna'];
            if (qp['centro'] && qp['centro'].toLowerCase() == val['idCentro'].toLowerCase()) {
              matCentro = res['centros'][key];
            }
          })

          res['centros'] = this.orderPipe.transform(res['centros'], 'detalle');

          this.centrosAtencion = this.priorizarCentro(res['centros']);

          if (matCentro) {
            this.centroAtencionCtrl.patchValue(matCentro);
            this.centroAtencionSelection(matCentro);
            this.buscarHora();
          } else {
            
            if(res['centros'].length == 1){
              this.centroAtencionCtrl.patchValue(res['centros'][0]);
              this.centroAtencionSelection(res['centros'][0]);
            }else if(objTodos && (this.utils.slugify(this.areaSelected.nombre, "-") === 'telemedicina' || this.utils.slugify(this.areaSelected.nombre, "-") === 'consulta-medica-virtual')){
              this.centroAtencionCtrl.patchValue(objTodos);
              this.centroAtencionSelection(objTodos);
            }

            this.emitterReadQuery(true)
          }


        } else {
          this.centrosAtencion = [];
          this.readQuery = true;
        }

        this.filterCentrosAtencion = this.centroAtencionCtrl.valueChanges.pipe(
          startWith<string | any>(''),
          map(value => typeof value === 'string' ? value : value.detalle),
          map(nombreFiltro => nombreFiltro ? this.filterAutocomplete(nombreFiltro, 'centros') : this.centrosAtencion.slice()),
        );

        this.loadedCen = true;
        setTimeout(()=> {
          this.utils.hideProgressBar();
        },2500)
      })

    })

  }

  getServicios(){

    let listServ = this.especialidadCtrl.value.servicios;
    this.servicios = (listServ && listServ.length > 0) ? listServ : [];
    
    this.setDataQueryParams().then(params => {

      let matServicio = null;
      let qp = params;
      
      if (this.servicios.length > 0) {
        
        this.servicios.forEach((val, key) => {
          if (qp['servicio'] && qp['servicio'].toLowerCase() == val['idServicio'].toLowerCase()) {
            matServicio = val;
          }
        })
        if (matServicio || this.servicios.length == 1) {
          let mServ = (this.servicios.length == 1) ? this.servicios[0] : matServicio ;
          this.servicioCtrl.patchValue(mServ);
          this.servicioSelection(mServ);
        } else {
          this.emitterReadQuery(true)
        }


      } else {
        this.readQuery = true;
      }

      this.filterServicios = this.servicioCtrl.valueChanges.pipe(
        startWith<string | any>(''),
        map(value => typeof value === 'string' ? value : value.detalle),
        map(nombreFiltro => nombreFiltro ? this.filterAutocomplete(nombreFiltro, 'servicios') : this.servicios.slice()),
      );

      this.loadedServ = true;

    });
    
  }

  especialidadSelection(event , tipo = null) {

    if (event.option && !event.option.value) {
      return false;
    }

    this.especialidadCtrl.disable();
    
    this.especialidadSelected = this.especialidadCtrl.value;
    gtag('event', 'Especialidad', { 'event_category': 'Reserva de Hora', 'event_label': this.especialidadSelected['nombreEspecialidad'], 'value' : '0' });

    if(tipo == 'especialidad'){
      this.getServicios()
    }else{
      this.getCentros(this.especialidadCtrl.value.idServicio);
    }

  }


  servicioSelection(event){
    this.servicioCtrl.disable();
    this.servicioSelected = this.servicioCtrl.value;
    this.getCentros(this.servicioCtrl.value.idServicio);
  }


  profesionalSelection(event) {
    this.profesionalCtrl.disable();
    this.profesionalSelected = this.profesionalCtrl.value;
    gtag('event', 'Profesional', { 'event_category': 'Reserva de Hora', 'event_label': this.profesionalSelected['nombreProfesional'], 'value' : '0' });
    this.getEspecialidades('profesional');
  }

  centroAtencionSelection(event) {
    this.centroAtencionCtrl.disable();
    this.centroAtencionSelected = this.centroAtencionCtrl.value;
  }

  buscarHora() {

    if(this.tipoConsulta == 'especialidad'){
      this.especialidadSelected['idServicio'] = this.servicioSelected['idServicio'];
      this.especialidadSelected['nombreServicio'] = this.servicioSelected['nombreServicio'];
    }
 

    this.emitBusqueda.emit({
      area: this.areaSelected,
      profesional: this.profesionalSelected,
      especialidad: this.especialidadSelected,
      centroAtencion: this.centroAtencionSelected
    })

    this.emitterReadQuery(true)
  }

  emitterReadQuery(status) {
    this.readQuery = status;
    if (status) {
      this.emitReadQuery.emit(status)
    }
  }

  async setDataQueryParams() {
    let p = {};
    await this.aRouter.queryParams.subscribe(params => {
      if (!this.readQuery) {
        p = params;
      }
    })
    return p;
  }

  cambiarTipoBusqueda(tipo) {

    this.clearSelection('profesional');

    if (tipo == 'especialidad') {
      this.getEspecialidades('especialidad')
    }

    if (tipo == 'profesional') {
      this.getProfesionales();
    }
  }
}