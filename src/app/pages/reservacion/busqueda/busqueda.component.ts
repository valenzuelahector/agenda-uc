import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { AgendaAmbulatoriaService } from 'src/app/services/agenda-ambulatoria.service';
import { FormControl } from '@angular/forms'
import { map, startWith, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { Observable, Observer } from 'rxjs';
import { UtilsService } from 'src/app/services/utils.service';
import { ActivatedRoute } from '@angular/router';
import { OrderPipe } from 'ngx-order-pipe';
import { ENV } from 'src/environments/environment';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.scss']
})
export class BusquedaComponent implements OnInit {

  public areas: any = []
  public especialidades: any = [];
  public profesionales: any = [];
  public filterEspecialidades: Observable<any[]>;
  public filterCentrosAtencion: Observable<any[]>;
  public filterProfesionales: Observable<any[]>;;

  public centrosAtencion: any = [];
  public areaSelected: any;
  public profesionalSelected: any;
  public especialidadSelected: any;
  public centroAtencionSelected: any;
  public tipoConsulta: string = "especialidad";

  public profesionalCtrl = new FormControl();
  public especialidadCtrl = new FormControl();
  public centroAtencionCtrl = new FormControl();
  public readQuery: boolean = false;

  public loadedProf: boolean = false;
  public loadedEsp: boolean = false;
  public loadedCen: boolean = false;

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

  getAreas() {
    this.agendaService.getAreas().subscribe(res => {

      if (res['areas'] && res['areas'].length > 0) {
        this.areas = res['areas'];

        this.setDataQueryParams().then(params => {
          let qp = params;
          this.areaSelected = {};

          res['areas'].forEach((val, key) => {
            if ((val['nombre'].toLowerCase() == 'consultas' && !qp['area']) ||
              (qp['area'] && qp['area'].toLowerCase() == val['id'].toLowerCase())) {
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
          this.filterProfesionales = this.orderPipe.transform(res['profesionales'], 'detalle');

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
                  observer.next({ profesionales: this.profesionales });
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

  getEspecialidades(tipo: string) {

    this.setDataQueryParams().then(params => {

      let qp = params;

      this.tipoConsulta = tipo;
      this.loadedEsp = false;

      let observer: any;
      if (tipo == 'profesional') {
        observer = this.agendaService.getEspecialidadesByProfesional(this.profesionalSelected['idProfesional'], this.areaSelected['id']);
      } else {
        let idServicio = (!this.loadedByUrlEspecialidades) ? qp['especialidad'] : null;

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

        if (res['especialidadesPorServicio'] && res['especialidadesPorServicio'].length > 0) {
          res['especialidadesPorServicio'].forEach((val, key) => {
            res['especialidadesPorServicio'][key]['detalle'] = val['nombreEspecialidad'] + " - " + val['nombreServicio'];

            if (qp['especialidad'] && qp['especialidad'].toLowerCase() == val['idServicio'].toLowerCase()) {
              matEspecialidad = val;
            }
          })

          this.especialidades = res['especialidadesPorServicio'];
          this.filterEspecialidades = res['especialidadesPorServicio'];

          if (matEspecialidad) {
            this.especialidadCtrl.patchValue(matEspecialidad);
            this.especialidadSelection(matEspecialidad);
          } else {
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
                  observer.next({ especialidadesPorServicio: this.especialidades });
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
            if (data['especialidadesPorServicio']) {
              data['especialidadesPorServicio'].forEach((val, key) => {
                data['especialidadesPorServicio'][key]['detalle'] = val['nombreEspecialidad'] + " - " + val['nombreServicio'];
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
      this.profesionalCtrl.enable();
      this.especialidadCtrl.enable();
      this.centroAtencionCtrl.enable();
      this.profesionalSelected = null;
      this.especialidadSelected = null;
      this.centroAtencionSelected = null;

      if(this.needLoadInitProfesionales && fromForm){
        this.getProfesionales();
        this.needLoadInitProfesionales = false;
      }

    }

    if (tipo == 'especialidad') {
      this.centroAtencionCtrl.setValue('');
      this.especialidadCtrl.setValue('');
      this.especialidadCtrl.enable();
      this.centroAtencionCtrl.enable();
      this.especialidadSelected = null;
      this.centroAtencionSelected = null;
      this.filterEspecialidades = this.especialidades;

      if(this.needLoadInitEspecialidades && fromForm){
        this.getEspecialidades('especialidad');
        this.needLoadInitEspecialidades = false;
      }
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

  especialidadSelection(event) {

    if (event.option && !event.option.value) {
      return false;
    }

    this.especialidadCtrl.disable();
    this.especialidadSelected = this.especialidadCtrl.value;
    this.centrosAtencion = [];
    let isProf = (this.profesionalSelected) ? this.profesionalSelected['idProfesional'] : null;
    this.loadedCen = false;

    this.agendaService.getCentrosByEspecialidad(this.especialidadCtrl.value.idServicio, this.areaSelected['id'], isProf).subscribe(res => {

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

        if (res['centros'].length >= 2) {
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
          res['centros'].unshift(objTodos)
        }

        if (res['centros'] && res['centros'].length > 0) {
          res['centros'].forEach((val, key) => {
            res['centros'][key]['detalle'] = val['nombre'] + ' - ' + val['direccion']['comuna'];
            if (qp['centro'] && qp['centro'].toLowerCase() == val['idCentro'].toLowerCase()) {
              matCentro = res['centros'][key];
            }
          })

          this.centrosAtencion = res['centros'];

          if (matCentro) {
            this.centroAtencionCtrl.patchValue(matCentro);
            this.centroAtencionSelection(matCentro);
            this.buscarHora();
          } else {
            
            if(res['centros'].length == 1){
              this.centroAtencionCtrl.patchValue(res['centros'][0]);
              this.centroAtencionSelection(res['centros'][0]);
            }else if(objTodos){
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
      })

    })

  }

  profesionalSelection(event) {
    this.profesionalCtrl.disable();
    this.profesionalSelected = this.profesionalCtrl.value;
    this.getEspecialidades('profesional');

  }

  centroAtencionSelection(event) {
    this.centroAtencionCtrl.disable();
    this.centroAtencionSelected = this.centroAtencionCtrl.value;
  }

  buscarHora() {

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
