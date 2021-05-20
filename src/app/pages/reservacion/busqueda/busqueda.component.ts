import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { AgendaAmbulatoriaService } from 'src/app/services/agenda-ambulatoria.service';
import { FormControl } from '@angular/forms'
import { map, startWith, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { Observable, Observer } from 'rxjs';
import { UtilsService } from 'src/app/services/utils.service';
import { ActivatedRoute } from '@angular/router';
import { OrderPipe } from 'ngx-order-pipe';
import { ENV } from 'src/environments/environment';
import gtag, { install } from 'ga-gtag';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material';
import { EncuestasComponent } from 'src/app/shared/components/modals/encuestas/encuestas.component';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.scss']
})
export class BusquedaComponent implements OnInit {

  public expanded = false;
  public areas: any = []
  public especialidades: any = [];
  public realEspecialidades: any = [];
  public profesionales: any = [];
  public servicios: any = [];

  public filterEspecialidades: Observable<any[]>;
  public filterCentrosAtencion: Observable<any[]>;
  public filterProfesionales: Observable<any[]>;;
  public filterServicios: Observable<any[]>;;

  public centrosAtencion: any = [];
  public areaSelected: any;
  public profesionalSelected: any;
  public especialidadSelected: any;
  public centroAtencionSelected: any;
  public servicioSelected: any;

  public tipoConsulta: string = "especialidad";

  public profesionalCtrl = new FormControl();
  public especialidadCtrl = new FormControl();
  public centroAtencionCtrl = new FormControl();
  public servicioCtrl = new FormControl();

  public readQuery: boolean = false;
  public hasQueryParams = false;
  public loadedProf: boolean = false;
  public loadedEsp: boolean = false;
  public loadedCen: boolean = false;
  public loadedServ: boolean = false;

  public loadingEspecialidades: boolean = false;
  public loadingProfesionales: boolean = false;

  public loadedByUrlEspecialidades: boolean = false;
  public loadedByUrlProfesionales: boolean = false;
  public needLoadInitEspecialidades: boolean = false;
  public needLoadInitProfesionales: boolean = false;
  public aplicaMedioContraste = false;
  public tituloIdt = 'Datos del Paciente';

  public datosPaciente: any = {
    tipoDocumento: 'RUN',
    documento: null,
    documentoFormateado: null,
    idPaciente: null
  }

  public datosImagenes = {
    aplicaMedioContraste: false,
    archivo: null,
    requierePresupuesto: false,
    idEncuesta: null
  }

  public datasUpload = [];
  public bloquearRadiologia = false;
  
  @Output() public emitReadQuery: EventEmitter<boolean> = new EventEmitter();
  @Output() public emitBusqueda: EventEmitter<any> = new EventEmitter();
  @Input() public etapaActual: number;

  @ViewChild('triggerEspecialidad', { read: MatAutocompleteTrigger, static: false }) triggerEspecialidad: MatAutocompleteTrigger;
  @ViewChild('triggerCentros', { read: MatAutocompleteTrigger, static: false }) triggerCentros: MatAutocompleteTrigger;
  @ViewChild('triggerServicios', { read: MatAutocompleteTrigger, static: false }) triggerServicios: MatAutocompleteTrigger;

  constructor(
    public agendaService: AgendaAmbulatoriaService,
    public utils: UtilsService,
    public aRouter: ActivatedRoute,
    public orderPipe: OrderPipe,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getAreas();
    // this.mostrarEncuesta({ data: null});
    this.utils.nuevaHora.subscribe(r => {
      this.clearSelection('profesional');
      this.cambiarTipoBusqueda('especialidad');
      this.datosPaciente = {
        tipoDocumento: 'RUN',
        documento: null,
        documentoFormateado: null,
        idPaciente: null
      }

      this.datosImagenes = {
        aplicaMedioContraste: false,
        archivo: null,
        requierePresupuesto: false,
        idEncuesta: null
      }

    });

  }

  getParamsArea() {
    return new Promise((resolve, reject) => {
      this.aRouter.params.subscribe(params => {
        resolve(params);
      })
    })
  }

  setIdentificacion(params) {
    if (params.rut && params.tipoDocumento) {
      this.datosPaciente = {
        tipoDocumento: params.tipoDocumento,
        documento: params.rut,
        documentoFormateado: this.utils.formatRut(params.rut)
      }
    }
  }

  getAreas() {
    this.agendaService.getAreas().subscribe(res => {

      if (res['areas'] && res['areas'].length > 0) {
        this.areas = res['areas'];

        this.setDataQueryParams().then(async params => {
          let qp = params;
          this.setIdentificacion(params);
          this.areaSelected = {};
          let paramArea = await this.getParamsArea();

          res['areas'].forEach((val, key) => {
            let setParamArea = false;
            if (paramArea && paramArea['area'] && this.utils.slugify(val['nombre'], "-") === this.utils.slugify(paramArea['area'], "-")) {
              this.areaSelected = val;
              setParamArea = true;
            }

            if (
              (
                (val['nombre'].toLowerCase() == 'consultas' && !qp['area']) ||
                (qp['area'] && qp['area'].toLowerCase() == val['id'].toString().toLowerCase())
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
            this.especialidadCtrl.disable();
            this.centroAtencionCtrl.disable();
          } else {
            this.especialidadCtrl.enable();
            this.servicioCtrl.disable();
            this.centroAtencionCtrl.disable();
            this.getEspecialidades('especialidad');
          }
          //gtag('config', ENV.analyticsCode, {'page_path': `/busqueda/${this.tipoConsulta}/area/${this.areaSelected.id}` });

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

      if (idProfesional) {
        this.needLoadInitProfesionales = true;
      }

      this.agendaService.getProfesionales(this.areaSelected['id'], null, idProfesional).subscribe(res => {

        this.clearSelection('profesional')

        this.profesionalCtrl.reset();

        let matchProfesional = null;

        if (res['profesionales'] && res['profesionales'].length > 0) {
          res['profesionales'].forEach((val, key) => {

            res['profesionales'][key]['detalle'] = val['nombreProfesional'];
            if (qp['profesional'] && qp['profesional'].toLowerCase() == val['idProfesional'].toString().toLowerCase()) {
              matchProfesional = val;
            }
          })

          this.profesionales = this.orderPipe.transform(res['profesionales'], 'detalle');

          if (matchProfesional) {
            this.profesionalCtrl.patchValue(matchProfesional);
            this.profesionalSelection(matchProfesional);
          } else {
            this.emitterReadQuery(true)
          }

        } else {
          this.profesionales = [];
        }

        this.valueChangeProfesional();

      })

    })


  }

  valueChangeProfesional() {


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

  }

  distinctEspecialidades(data) {

    let especialidades = [];

    if (data && data['especialidades'] && data['especialidades'].length > 0) {
      data['especialidades'].forEach((val, key) => {
        especialidades = especialidades.concat(val);
      });
    }

    return { especialidadesPorServicio: especialidades };
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

        if (!this.loadedByUrlEspecialidades) {
          idServicio = (this.tipoConsulta == 'especialidad') ? qp['servicio'] : qp['especialidad'];
        }

        if (idServicio) {
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
        if (tipo == 'especialidad') {
          res = this.distinctEspecialidades(res);
        }

        if (res['especialidadesPorServicio'] && res['especialidadesPorServicio'].length > 0) {
          res['especialidadesPorServicio'].forEach((val, key) => {

            if (tipo == 'especialidad') {
              res['especialidadesPorServicio'][key]['detalle'] = val['nombreEspecialidad'];
            } else {
              res['especialidadesPorServicio'][key]['detalle'] = val['nombreEspecialidad'] + " - " + val['nombreServicio'];
            }

            if ((tipo == 'profesional' && qp['especialidad'] && qp['especialidad'].toLowerCase() == val['idServicio'].toString().toLowerCase()) ||
              (tipo == 'especialidad' && qp['especialidad'] && qp['especialidad'].toLowerCase() == val['idEspecialidad'].toString().toLowerCase())) {
              matEspecialidad = val;
            }

          });

          this.especialidades = this.orderPipe.transform(res['especialidadesPorServicio'], 'detalle');
          this.filterEspecialidades = this.orderPipe.transform(res['especialidadesPorServicio'], 'detalle');

          if (matEspecialidad) {
            this.especialidadCtrl.patchValue(matEspecialidad);
            this.especialidadSelection(matEspecialidad, tipo);
          } else {

            if (tipo == 'profesional') {
              if (res['especialidadesPorServicio'].length == 1) {
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

        this.filterEspecialidades = this.especialidadCtrl.valueChanges.pipe(
          startWith<string | any>(''),
          map(value => typeof value === 'string' ? value : value.detalle),
          map(nombreFiltro => nombreFiltro ? this.filterAutocomplete(nombreFiltro, 'especialidades') : this.especialidades.slice()),
        );

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
    this.tituloIdt = 'Datos del Paciente';
    this.tipoConsulta = 'especialidad';
    this.filterEspecialidades = null;
    this.filterServicios = null;
    this.filterCentrosAtencion = null;
    this.getEspecialidades('especialidad');
    this.expanded = false;
    console.log(ENV.bloquearAreaRadiologia)
    if(ENV.bloquearAreaRadiologia && this.areaSelected.id === 'RIS_IMAGENES'){
        this.bloquearRadiologia = true;
    }else{
      this.bloquearRadiologia = false;
    }

    //gtag('config', ENV.analyticsCode, {'page_path': `/busqueda/${this.tipoConsulta}/area/${this.areaSelected.id}` });

  }

  clearSelection(tipo: string, fromForm: boolean = false) {

    if (tipo == 'profesional') {
      this.profesionalCtrl.setValue('');
      this.especialidadCtrl.setValue('');
      this.centroAtencionCtrl.setValue('');
      this.servicioCtrl.setValue('');
      this.profesionalCtrl.enable();
      this.especialidadCtrl.disable();
      this.servicioCtrl.disable();
      this.centroAtencionCtrl.disable();
      this.profesionalSelected = null;
      this.especialidadSelected = null;
      this.servicioSelected = null;
      this.centroAtencionSelected = null;

      if (this.needLoadInitProfesionales && fromForm) {
        this.getProfesionales();
        this.needLoadInitProfesionales = false;
      }

    }

    if (tipo == 'especialidad') {
      this.centroAtencionCtrl.setValue('');
      this.servicioCtrl.setValue('');
      this.especialidadCtrl.setValue('');
      this.especialidadCtrl.enable();
      this.servicioCtrl.disable();
      this.centroAtencionCtrl.disable();
      this.especialidadSelected = null;
      this.servicioSelected = null;
      this.centroAtencionSelected = null;

      if (fromForm) {

        setTimeout(() => {
          try {
            this.triggerEspecialidad.openPanel();
          } catch (err) {
          }
        }, 500);

      }


      if (this.needLoadInitEspecialidades && fromForm) {
        this.getEspecialidades('especialidad');
        this.needLoadInitEspecialidades = false;
      }
    }

    if (tipo == 'servicio') {
      this.servicioCtrl.setValue('');
      this.centroAtencionCtrl.setValue('');
      this.servicioCtrl.enable();
      this.centroAtencionCtrl.disable();
      this.servicioSelected = null;

      setTimeout(() => {
        try {
          this.triggerServicios.openPanel();
        } catch (err) {
        }
      }, 500);

    }

    if (tipo == 'centros') {
      this.centroAtencionCtrl.setValue('');
      this.centroAtencionCtrl.enable();
      this.centroAtencionSelected = null;

      setTimeout(() => {
        try {
          this.triggerCentros.openPanel();
        } catch (err) {
        }
      }, 500);
    }

    this.emitBusqueda.emit({
      area: null,
      profesional: null,
      especialidad: null,
      centroAtencion: null
    })
  }

  priorizarCentro(data) {

    let centroPrioritario = ENV.idCentroPrioritario;
    let centros = [];
    let centroTodos = null;
    for (let centro of data) {
      if (centro['codigo'] !== 'todos') {
        if (centroPrioritario === centro['idCentro']) {
          centros.unshift(centro);
        } else {
          centros.push(centro);
        }
      } else {
        centroTodos = centro;
      }
    }

    if (data.length >= 2) {
      centros.push(centroTodos);
    }

    return centros;
  }

  organizarCentros(centros) {
    let arrCentros = [];
    const clSanCarlos = centros.find(item => item.detalle.toLowerCase().includes('san carlos'));
    const clTodos = centros.find(item => item.detalle.toLowerCase().includes('todos'));
    const centrosSinTodosSanCarlos: any[] = centros.filter(item => {
      const validSanCarlos = item.detalle.toLowerCase().includes('san carlos');
      const validTodos = item.detalle.toLowerCase().includes('todos')
      if (!validSanCarlos && !validTodos) {
        return item;
      }
    });

    if (clTodos) {
      arrCentros.push(clTodos);
    }

    if (clSanCarlos) {
      arrCentros.push(clSanCarlos);
    }

    const arr = arrCentros.concat(centrosSinTodosSanCarlos);

    return arr;
  }

  getCentros(idServicio) {

    let isProf = (this.profesionalSelected) ? this.profesionalSelected['idProfesional'] : null;
    this.centrosAtencion = [];
    this.loadedCen = false;
    this.agendaService.getCentrosByEspecialidad(idServicio, this.areaSelected['id'], isProf, true).subscribe(res => {

      this.setDataQueryParams().then(params => {

        let matCentro = null;
        let qp = params;

        if (qp['centro']) {
          this.hasQueryParams = true;
        }
        let region = (res['regiones'] && res['regiones'][0]) ? res['regiones'][0]['idRegion'] : null;

        if (!res['centros']) {
          res['centros'] = [];
        }

        res['centros'].forEach((val, key) => {
          ENV.idCentrosNoDisponibles.forEach((v, k) => {
            if (val['idCentro'] == v) {
              res['centros'].splice(key, 1);
            }
          });
        });

        let objTodos: any;

        if (res['centros'].length >= 2 || this.utils.slugify(this.areaSelected.nombre, "-") === 'telemedicina' || this.utils.slugify(this.areaSelected.nombre, "-") === 'consulta-medica-virtual') {
          objTodos = {
            direccion: { calle: null, numero: null, piso: null, comuna: 'Región Metropolitana' },
            horaApertura: null,
            horaCierre: null,
            idCentro: ENV.idRegion,
            idRegion: ENV.idRegion,
            latitud: null,
            longitud: null,
            nombre: "Todos",
            codigo: 'todos',
            detalle: 'Todos - Región Metropolitana'
          }

          res['centros'].unshift(objTodos);
        }

        if (res['centros'] && res['centros'].length > 0) {
          res['centros'].forEach((val, key) => {
            res['centros'][key]['detalle'] = val['detalle'] ? val['detalle'] : val['nombre'];
            if (qp['centro'] && qp['centro'].toLowerCase() == val['idCentro'].toString().toLowerCase()) {
              matCentro = res['centros'][key];
            }
          })

          res['centros'] = this.orderPipe.transform(res['centros'], 'detalle');
          res['centros'] = this.organizarCentros(res['centros']);
          this.centrosAtencion = res['centros'];

          if (matCentro) {
            this.centroAtencionCtrl.patchValue(matCentro);
            this.centroAtencionSelection(matCentro);
            if (this.datosPaciente.documento && this.areaSelected.id !== 'RIS_IMAGENES') {
              this.buscarHora();
            } else {
              this.emitterReadQuery(true)
            }

          } else {

            if (res['centros'].length == 1 || (res['centros'].length > 1 && this.tipoConsulta === 'profesional')) {
              this.centroAtencionCtrl.patchValue(res['centros'][0]);
              this.centroAtencionSelection(res['centros'][0]);
            } else if (objTodos && (this.areaSelected.id === 'RIS_IMAGENES' || this.areaSelected.nombre.toLowerCase() === 'telemedicina')) {
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
        setTimeout(() => {
          this.utils.hideProgressBar();
        }, 2500)
      })

    })

  }

  async getServicios() {

    const resServ = await this.agendaService.getServiciosByEspecialidad(this.especialidadSelected.idEspecialidad, this.areaSelected.id);
    const listServ = resServ && resServ['servicios'] ? resServ['servicios'] : [];
    this.servicios = (listServ && listServ.length > 0) ? listServ : [];

    this.setDataQueryParams().then(params => {

      let matServicio = null;
      let qp = params;

      if (this.servicios.length > 0) {

        this.servicios.forEach((val, key) => {
          this.servicios[key]['idServicio'] = val['id'];
          this.servicios[key]['nombreServicio'] = val['nombre'];
          this.servicios[key]['detalle'] = val['nombre'];
          if (qp['servicio'] && qp['servicio'].toLowerCase() == val['idServicio'].toLowerCase()) {
            matServicio = val;
          }
        })
        if (matServicio || this.servicios.length == 1) {
          let mServ = (this.servicios.length == 1) ? this.servicios[0] : matServicio;
          this.servicioCtrl.patchValue(mServ);
          this.servicioSelection(mServ);
        } else {
          this.emitterReadQuery(true)
        }


      } else {
        this.readQuery = true;
      }

      this.servicios = this.transformarRepuestaGeneral(this.servicios);

      this.filterServicios = this.servicioCtrl.valueChanges.pipe(
        startWith<string | any>(''),
        map(value => typeof value === 'string' ? value : value.detalle),
        map(nombreFiltro => nombreFiltro ? this.filterAutocomplete(nombreFiltro, 'servicios') : this.servicios.slice()),
      );

      this.loadedServ = true;

    });

  }

  transformarRepuestaGeneral(servicios) {

    const arrWithGeneral = [];
    const arrWithoutGeneral = [];

    servicios.forEach((val, key) => {
      if (val.nombre.toLowerCase().includes('general')) {
        arrWithGeneral.push(val);
      } else {
        arrWithoutGeneral.push(val);
      }
    });

    const orderedArrWithGeneral = this.orderPipe.transform(arrWithGeneral, 'nombre');
    const orderedArrWithoutGeneral = this.orderPipe.transform(arrWithoutGeneral, 'nombre');

    return orderedArrWithGeneral.concat(orderedArrWithoutGeneral);

  }

  especialidadSelection(event, tipo = null) {

    if (event.option && !event.option.value) {
      return false;
    }

    this.especialidadCtrl.disable();

    this.especialidadSelected = this.especialidadCtrl.value;

    if (tipo == 'especialidad') {
      this.getServicios();
      this.servicioCtrl.enable();
      /*gtag('config', ENV.analyticsCode, 
      {'page_path': `/busqueda/${this.tipoConsulta}/area/${this.areaSelected.id}` });*/

    } else {
      this.centroAtencionCtrl.enable();
      this.getCentros(this.especialidadCtrl.value.idServicio);
     /* gtag('config', ENV.analyticsCode, 
      {'page_path': `/busqueda/${this.tipoConsulta}/area/${this.areaSelected.id}/profesional/${this.profesionalSelected.idProfesional}/servicio/${this.especialidadSelected.idServicio}/` });*/
    }

  }

  servicioSelection(event) {
    this.servicioCtrl.disable();
    this.servicioSelected = this.servicioCtrl.value;
    this.verificarDonantePaciente();
    this.centroAtencionCtrl.enable();
    this.getCentros(this.servicioCtrl.value.idServicio);
    //gtag('config', ENV.analyticsCode, {'page_path': `/busqueda/${this.tipoConsulta}/area/${this.areaSelected.id}/servicio/${this.servicioCtrl.value.idServicio}` });

  }


  profesionalSelection(event) {
    this.profesionalCtrl.disable();
    this.profesionalSelected = this.profesionalCtrl.value;
    this.especialidadCtrl.enable();
    this.getEspecialidades('profesional');

    if(this.tipoConsulta === 'especialidad'){
     /* gtag('config', ENV.analyticsCode, 
      {'page_path': `/busqueda/${this.tipoConsulta}/area/${this.areaSelected.id}` });*/
    }else{
      /*gtag('config', ENV.analyticsCode, 
      {'page_path': `/busqueda/${this.tipoConsulta}/area/${this.areaSelected.id}/profesional/${this.profesionalSelected.idProfesional}/` });*/
    }


  }

  centroAtencionSelection(event) {
    this.centroAtencionCtrl.disable();
    this.centroAtencionSelected = this.centroAtencionCtrl.value;

    if(this.tipoConsulta === 'especialidad'){
    /*  gtag('config', ENV.analyticsCode, 
      {'page_path': `/busqueda/${this.tipoConsulta}/area/${this.areaSelected.id}/servicio/${this.servicioCtrl.value.idServicio}/centro/${this.centroAtencionCtrl.value.idCentro}` });*/
    }else{
      /*gtag('config', ENV.analyticsCode, 
      {'page_path': `/busqueda/${this.tipoConsulta}/area/${this.areaSelected.id}/profesional/${this.profesionalSelected.idProfesional}/servicio/${this.especialidadSelected.idServicio}/centro/${this.centroAtencionCtrl.value.idCentro}` });*/
    }

    if (this.hasQueryParams) {
      this.buscarHora();
    }
  }

  verificarDonantePaciente() {

    const idEspecialidad = this.especialidadSelected.idEspecialidad;
    const idServicio = this.servicioSelected.idServicio;
    if (idServicio === ENV.donacionBancoDeSangre.idServicio && idEspecialidad === ENV.donacionBancoDeSangre.idEspecialidad) {
      this.tituloIdt = 'Datos del Donante';
    } else {
      this.tituloIdt = 'Datos del Paciente';
    }

  }

  async buscarHora(fromBtn = false) {

    const dateTm: any = this.utils.trDateStr(new Date(), null, -240);
    const dateTime = dateTm.split("-04:00").join("");
    const gtagActionName = `(${dateTime}) - ${this.datosPaciente.tipoDocumento} : ${this.datosPaciente.documento}`;
    const gtagName = 'PROCESO DE RESERVA DE HORA';
    let gtagNameEsp = "PROCESO DE RESERVA DE HORA"
    let gtagActionEspProf = "";

    if (this.tipoConsulta === 'profesional' && !this.profesionalSelected) {
      this.utils.mDialog('Error', 'Debe seleccionar el Profesional con quien se desea atender.', 'message');
      return false;
    }

    if (!this.especialidadSelected) {
      this.utils.mDialog('Error', 'Debe seleccionar una Especialidad Médica.', 'message');
      return false;
    }

    if (!this.servicioSelected && this.tipoConsulta === 'especialidad') {
      this.utils.mDialog('Error', 'Debe seleccionar una Área de Interés.', 'message');
      return false;
    }

    if (!this.centroAtencionSelected && this.areaSelected.nombre.toLowerCase() !== 'telemedicina') {
      this.utils.mDialog('Error', 'Debe seleccionar un Centro de Atención.', 'message');
      return false;
    }

    if (!this.datosPaciente.documento && fromBtn) {
      this.utils.mDialog('Error', 'Debe indicar su identificación.', 'message');
      return false;
    }

    if ((this.datosPaciente.tipoDocumento === 'RUN' && !this.utils.validateRun(this.datosPaciente.documento)) && fromBtn) {
      this.utils.mDialog('Error', 'El formato del RUN es incorrecto. Verifique e intente nuevamente', 'message');
      return false;
    }

    if (this.tipoConsulta == 'especialidad') {
      gtagNameEsp += ' | ESPECIALIDAD';
      gtagActionEspProf = this.especialidadSelected.nombreEspecialidad.toUpperCase();
      this.especialidadSelected['idServicio'] = this.servicioSelected['idServicio'];
      this.especialidadSelected['nombreServicio'] = this.servicioSelected['nombreServicio'];
    }

    if (this.profesionalSelected) {
      gtagNameEsp += ' | PROFESIONAL';
      gtagActionEspProf = this.profesionalSelected.nombreProfesional.toLowerCase();
      gtag('event', gtagActionName, { 'event_category': gtagName, 'event_label': `a.1) Profesional: ${this.profesionalSelected.nombreProfesional}`, 'value': '0' });
      gtag('event', gtagActionEspProf, { 'event_category': gtagNameEsp, 'event_label': `a.1) Profesional: ${this.profesionalSelected.nombreProfesional}`, 'value': '0' });

    }

    let continueEncuesta: any = true;
    let completaEncuesta = false;
    try {

      if (this.areaSelected.id === 'RIS_IMAGENES') {

        if (!this.datosImagenes.archivo) {
          this.utils.mDialog("Error", "Debe adjuntar orden médica.", "message");
          return;
        }
        const codCentro = this.centroAtencionSelected.codigo && this.centroAtencionSelected.codigo === 'todos' ? null : this.centroAtencionSelected.idCentro;
        const respEnc: any = await this.agendaService.getEncuesta(this.servicioSelected.id, codCentro, this.datosImagenes.aplicaMedioContraste);
        if (respEnc && respEnc.encuesta && respEnc.encuesta.length > 0) {
          const ressp: any = await this.mostrarEncuesta({ ...this.datosPaciente, ...respEnc });
          completaEncuesta = true;
          continueEncuesta = ressp.action;
          this.datosImagenes.idEncuesta = ressp.idRespuesta;
        }
      }

    } catch (err) {
      continueEncuesta = false;
    }

    if (!continueEncuesta) {
      return;
    }


    gtag('event', gtagActionName, { 'event_category': gtagName, 'event_label': `a) Área Médica: ${this.areaSelected.nombre}`, 'value': '0' });
    gtag('event', gtagActionName, { 'event_category': gtagName, 'event_label': `b) Especiallidad: ${this.especialidadSelected.nombreEspecialidad}`, 'value': '0' });
    gtag('event', gtagActionName, { 'event_category': gtagName, 'event_label': `c) Área de Interés: ${this.especialidadSelected.nombreServicio}`, 'value': '0' });
    gtag('event', gtagActionName, { 'event_category': gtagName, 'event_label': `d) Centro Médico:  ${this.centroAtencionSelected ? this.centroAtencionSelected.nombre : ''}`, 'value': '0' });
    
    if(completaEncuesta){
      gtag('event', gtagActionName, { 'event_category': gtagName, 'event_label': `e) Completa Encuesta en Área Imágenes`, 'value': '0' });
      gtag('event', gtagActionName, { 'event_category': gtagName, 'event_label': `f) Adjunta Orden Médica`, 'value': '0' });
    }
    
    gtag('event', gtagActionName, { 'event_category': gtagName, 'event_label': 'g) ETAPA 1 COMPLETADA', 'value': '0' });

    gtag('event', gtagActionEspProf, { 'event_category': gtagNameEsp, 'event_label': `a) Área Médica: ${this.areaSelected.nombre}`, 'value': '0' });
    gtag('event', gtagActionEspProf, { 'event_category': gtagNameEsp, 'event_label': `b) Especiallidad: ${this.especialidadSelected.nombreEspecialidad}`, 'value': '0' });
    gtag('event', gtagActionEspProf, { 'event_category': gtagNameEsp, 'event_label': `c) Área de Interés: ${this.especialidadSelected.nombreServicio}`, 'value': '0' });
    gtag('event', gtagActionEspProf, { 'event_category': gtagNameEsp, 'event_label': `d) Centro Médico: ${this.centroAtencionSelected ? this.centroAtencionSelected.nombre : ''}`, 'value': '0' });
    
    if(completaEncuesta){
      gtag('event', gtagActionEspProf, { 'event_category': gtagNameEsp, 'event_label': `e) Completa Encuesta en Área Imágenes`, 'value': '0' });
      gtag('event', gtagActionEspProf, { 'event_category': gtagNameEsp, 'event_label': `f) Adjunta Orden Médica`, 'value': '0' });
    }
    
    gtag('event', gtagActionEspProf, { 'event_category': gtagNameEsp, 'event_label': 'g) ETAPA 1 COMPLETADA', 'value': '0' });


    await this.getDatosPaciente();

    if(this.tipoConsulta === 'especialidad'){
        gtag('config', ENV.analyticsCode, 
        {'page_path': `/busqueda/${this.tipoConsulta}/area/${this.areaSelected.id}/servicio/${this.servicioCtrl.value.idServicio}/centro/${this.centroAtencionCtrl.value.idCentro}` });
      }else{
        gtag('config', ENV.analyticsCode, 
        {'page_path': `/busqueda/${this.tipoConsulta}/area/${this.areaSelected.id}/profesional/${this.profesionalSelected.idProfesional}/servicio/${this.especialidadSelected.idServicio}/centro/${this.centroAtencionCtrl.value.idCentro}` });
      }

    this.emitBusqueda.emit({
      tipoConsulta: this.tipoConsulta,
      area: this.areaSelected,
      profesional: this.profesionalSelected,
      especialidad: this.especialidadSelected,
      centroAtencion: this.centroAtencionSelected,
      documentoPaciente: this.datosPaciente,
      centrosDisponibles: [],
      datosImagenes: this.datosImagenes,
      gtagActionName,
      gtagName,
      gtagActionEspProf,
      gtagNameEsp
    })

    this.emitterReadQuery(true);

  }

  getDatosPaciente() {
    return new Promise((resolve, reject) => {

      try {
        const tipoDocumento = this.datosPaciente.tipoDocumento;
        const documento = this.datosPaciente.documento;
        this.agendaService.getPaciente(documento, tipoDocumento, this.areaSelected.id).subscribe((res: any) => {
          if (res && res.listaPacientes && res.listaPacientes.length > 0) {
            this.datosPaciente.idPaciente = res.listaPacientes[0].id;
          }
          resolve(true);
        }, () => {
          resolve(true);
        });

      } catch (err) {
        resolve(true);
      }
    });

  }

  buscarProximaHora(data) {
    data['fromCuposInmediatos'] = true;
    data['documentoPaciente']  =  {
      tipoDocumento: 'RUN',
      documento: null,
      documentoFormateado: null
    }

    this.emitBusqueda.emit(data);

    if(!data.profesional){
      gtag('config', ENV.analyticsCode, 
      {'page_path': `/busqueda/cuposinmediatos/area/${data.area.id}/servicio/${data.especialidad.idServicio}/centro/${data.centroAtencion.idCentro}` });
    }else{
      gtag('config', ENV.analyticsCode, 
      {'page_path': `/busqueda/cuposinmediatos/area/${data.area.id}/profesional/${data.profesional.idProfesional}/servicio/${data.especialidad.idServicio}/centro/${data.centroAtencion.idCentro}` });
    }
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
    this.tituloIdt = 'Datos del Paciente';
    if (tipo == 'especialidad') {
      this.tipoConsulta = 'especialidad';
      this.filterEspecialidades = null;
      this.filterServicios = null;
      this.filterCentrosAtencion = null;
      this.getEspecialidades('especialidad')
    }

    if (tipo == 'profesional') {
      this.tipoConsulta = 'profesional';
      this.loadedProf = true;
      this.filterEspecialidades = null;
      this.filterCentrosAtencion = null;
      this.valueChangeProfesional();
      //this.getProfesionales();
    }
  }

  setFormatRut() {
    this.datosPaciente.documentoFormateado = (this.datosPaciente.documentoFormateado) ?
      this.datosPaciente.documentoFormateado.trim() : null;

    if (this.datosPaciente.tipoDocumento == 'RUN') {
      let rut = this.datosPaciente.documentoFormateado;
      if (rut && rut != "") {
        let rutPuntos = this.utils.formatRut(rut)
        this.datosPaciente.documentoFormateado = rutPuntos
        this.datosPaciente.documento = this.utils.replaceAll(rutPuntos, ".", "");
      }
    } else {
      this.datosPaciente.documento = this.datosPaciente.documentoFormateado;
    }

  }

  restoreFormatRut() {
    if (this.datosPaciente.documentoFormateado && this.datosPaciente.documentoFormateado != "" && this.datosPaciente.tipoDocumento == 'RUN') {
      let documento = this.datosPaciente.documentoFormateado.trim();
      documento = this.utils.replaceAll(documento, ".", "");
      documento = this.utils.replaceAll(documento, "-", "");
      this.datosPaciente.documentoFormateado = documento;
    }
  }


  cambiarTipoIdentificacion(e) {
    this.datosPaciente = {
      tipoDocumento: e,
      documento: null,
      documentoFormateado: null
    }
  }

  mostrarEncuesta(respEnc) {
    return new Promise((resolve, reject) => {
      const dialogConfirm = this.dialog.open(EncuestasComponent, {
        width: '840px',
        autoFocus: false,
        disableClose: true,
        data: respEnc,
      });

      dialogConfirm.componentInstance.dialogEvent.subscribe(res => {
        resolve(res)
      });
    });
  }


  resetInputFile() {
    let input = document.getElementById("ordenmedica");
    input['value'] = "";
  }

  openInputFile() {
    document.getElementById("ordenmedica").click();
  }

  async fileChange(files: File[]) {

    let datasUpload = [];
    this.datasUpload = []

    try {

      for await (let a of Object.keys(files)) {
        const filesArr = await this.utils.prepareFile(files[a], true);
        datasUpload = datasUpload.concat(filesArr)
      }

      this.datasUpload = datasUpload;
      this.datosImagenes.archivo = this.datasUpload[0];
      this.resetInputFile();

    } catch (err) {

      return;

    }

  }

  borrarArchivo() {
    this.datosImagenes.archivo = null;
  }

}