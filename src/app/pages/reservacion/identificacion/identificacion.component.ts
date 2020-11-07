import { Component, OnInit, ViewChild, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { AgendaAmbulatoriaService } from 'src/app/services/agenda-ambulatoria.service';
import { FormControl, FormGroup, Validators, FormGroupDirective } from '@angular/forms'
import gtag, { install } from 'ga-gtag';
import { ErrorReservaComponent } from 'src/app/shared/components/modals/error-reserva/error-reserva.component';
import { MatDialog } from '@angular/material';
import { ENV } from 'src/environments/environment';
import { OrderPipe } from 'ngx-order-pipe';
import * as clone from 'clone';


@Component({
  selector: 'app-identificacion',
  templateUrl: './identificacion.component.html',
  styleUrls: ['./identificacion.component.scss']
})
export class IdentificacionComponent implements OnInit, OnChanges {

  @Output() datosPaciente: EventEmitter<any> = new EventEmitter();
  @Output() confirmacionListaEspera: EventEmitter<any> = new EventEmitter();
  @Output() confirmacionProcedimiento: EventEmitter<any> = new EventEmitter();
  @Input() busquedaInicial: any;
  @Input() calendario: any;
  @Input() rutMatch;
  @Input() listaEspera: any;
  @Input() isProcedimiento: boolean = false;

  public today: Date = new Date();
  public paciente: any;
  public findPaciente: boolean = false;
  public editDir: boolean = false;
  public planesSalud: any = [];
  public paises: any = [];
  public regiones: any = [];
  public comunas: any = [];
  public identifText = 'Identificación del Paciente';
  public infoAdicionaPaciente: any = {
    telefono: null,
    correo: null
  }

  public busquedaPaciente: any = {
    tipoDocumento: "RUN",
    documento: 'a',
    documentoFormateado: 'a',
    prevision: null,
    telefono: null,
    correo: null,
    direccion: null
  }

  public listaEsperaSeleccion = {
    horario: null,
    centro: null,
    profesional: null
  }

  public procedimientoSeleccion = {
    centro: null,
    horario: null,
    generarPresupuesto: false,
    celularPref: false,
    correoPref: true,
    archivo: null,
    prevision: null
  }

  public dirUpdate = {
    pais: null,
    region: null,
    comuna: null,
    calle: null,
    numero: null
  }

  public centros = [];
  public profesionales = [];
  public datasUpload = [];

  @ViewChild("formDirective", { static: false }) formDirective: FormGroupDirective;

  public pacienteForm = new FormGroup({
    identificador: new FormControl('', [Validators.required]),
    nombre: new FormControl('', Validators.required),
    apellido_paterno: new FormControl('', Validators.required),
    apellido_materno: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.email]),
    sexo: new FormControl('', Validators.required),
    fecha_nacimiento: new FormControl('', Validators.required),
    fono_movil: new FormControl('', Validators.required),
    tipo_identificador: new FormControl('', Validators.required),
    pais_emisor_identificador: new FormControl('', Validators.required),
    prevision: new FormControl(''),
    fono_fijo: new FormControl(''),
    dir_region: new FormControl(''),
    dir_comuna: new FormControl(''),
    dir_calle: new FormControl(''),
    dir_numero: new FormControl(''),
    dir_pais: new FormControl(''),
  });

  constructor(
    public utils: UtilsService,
    public agendaService: AgendaAmbulatoriaService,
    public dialog: MatDialog,
    public orderPipe: OrderPipe

  ) {

  }

  ngOnChanges() {

    if (this.busquedaInicial) {

      this.limpiarFormulario(true);
      if (this.rutMatch || (this.busquedaInicial.documentoPaciente && this.busquedaInicial.documentoPaciente.documento)) {
        const documento = this.rutMatch ? this.rutMatch : this.busquedaInicial.documentoPaciente.documento;
        const tipoDocumento = this.rutMatch ? 'RUN' : this.busquedaInicial.documentoPaciente.tipoDocumento;
        this.busquedaPaciente.documento = documento;
        this.busquedaPaciente.documentoFormateado = tipoDocumento === 'RUN' ? this.utils.formatRut(documento) : documento;
        this.busquedaPaciente.tipoDocumento = tipoDocumento;
        this.buscarPaciente();
      }

      const idEspecialidad = this.busquedaInicial.especialidad.idEspecialidad;
      const idServicio = this.busquedaInicial.especialidad.idServicio;
      const idArea = this.busquedaInicial.area.id;

      if (idServicio === ENV.donacionBancoDeSangre.idServicio && idEspecialidad === ENV.donacionBancoDeSangre.idEspecialidad) {
        this.identifText = 'Identificación del Donante';
      } else {
        this.identifText = 'Identificación del Paciente';
      }

      if (this.listaEspera) {
        this.getProfesionales(idServicio);
      }

      if (this.isProcedimiento) {

        this.procedimientoSeleccion = {
          centro: null,
          horario: null,
          generarPresupuesto: false,
          celularPref: false,
          correoPref: true,
          archivo: null,
          prevision: null
        }

        this.getCentros(idServicio, idArea, null);
        this.resetDir();

      }

      
      if(this.calendario){
        this.getPaises();
      }

    }

  }

  ngOnInit() {

    this.utils.resetInfoPaciente.subscribe(r => {
      this.limpiarFormulario(true);
    });

  }

  get revPacienteForm() {
    return this.pacienteForm.controls;
  }

  getPlanesSalud(idPaciente, data = null) {
    this.agendaService.getPlanesSalud(idPaciente, data).subscribe(data => {
      if (data['statusCod'] == 'OK') {

        data['companias'].forEach((val, key) => {
          val['planes'].forEach((valp, keyp) => {
            data['companias'][key]['planes'][keyp]['id'] = valp['idPlan'];
          });
        });

        if (data['companiasExtendido']) {
          data['companiasExtendido'].forEach((val, key) => {
            val['planes'].forEach((valp, keyp) => {
              data['companiasExtendido'][key]['planes'][keyp]['id'] = valp['idPlan'];
            });
          });

          this.busquedaPaciente.prevision = data['companias'][0]['planes'][0];
          this.cambioPrevision();
        }

        this.planesSalud = data;
      }
    })
  }

  resetDir() {
    //this.getRegiones();
    this.comunas = [];
    this.editDir = false;
    this.dirUpdate = {
      pais: null,
      region: null,
      comuna: null,
      calle: null,
      numero: null
    }
  }

  async actualizarDir() {

    let dirup = clone(this.dirUpdate);

    if (!dirup['region']) {
      this.utils.mDialog('Error', 'Debe seleccionar una Región.', 'message');
      return false;
    }

    if (!dirup['comuna']) {
      this.utils.mDialog('Error', 'Debe seleccionar una Comuna', 'message');
      return false;
    }

    if (!dirup['calle']) {
      this.utils.mDialog('Error', 'Debe indicar una calle.', 'message');
      return false;
    }

    if (!dirup['numero']) {
      this.utils.mDialog('Error', 'Debe un número de calle.', 'message');
      return false;
    }

    dirup['region'] = dirup['region']['id'];
    dirup['pais'] = dirup['pais']['id'];

    const data = {
      direccion: dirup,
      idPRM: this.paciente.id
    }

    const resp = await this.updDatosBusqCliente(data);

    if (resp) {
      this.resetDir();
      this.buscarPaciente();
    } else {
      this.utils.mDialog('Error', "No se pudo actualizar la dirección. Intente más tarde", "message");
    }
  }

  cerrarDir() {
    this.editDir = false;
    this.resetDir();
  }

  buscarPaciente() {

    this.findPaciente = false;
    if (!this.busquedaPaciente.documento || !this.busquedaPaciente.documento) {
      this.utils.mDialog("Error", "El número de documento es requerido", "message");
      return false;
    }

    this.busquedaPaciente.documento = this.busquedaPaciente.documento.trim();

    if (this.busquedaPaciente.tipoDocumento == 'RUN' && !this.utils.validateRun(this.busquedaPaciente.documento.trim())) {
      this.utils.mDialog("Error", "El RUN ingresado no es válido. Verifique e intente nuevamente.", "message");
      return false;
    }

    if (this.busquedaPaciente.tipoDocumento == 'PAS' && this.busquedaPaciente.documento.trim().length > 15) {
      this.utils.mDialog("Error", "El número de pasaporte debe tener máximo 15 caracteres.", "message");
      return false;
    }

    this.agendaService.getPaciente(this.busquedaPaciente.documento, this.busquedaPaciente.tipoDocumento).subscribe(res => {

      if (res['listaPacientes'] && res['listaPacientes'][0]) {
        this.paciente = res['listaPacientes'][0];
        this.busquedaPaciente.telefono = res['listaPacientes'][0]['numeroTelefonoPrincipal'];
        this.busquedaPaciente.correo = res['listaPacientes'][0]['email'];
        this.busquedaPaciente.direccion = res['listaPacientes'][0]['direccion']
        this.getPlanesSalud(this.paciente.id);
        this.resetDir();

      } else {
        this.getPlanesSalud(null, this.busquedaPaciente);
      }

      this.findPaciente = true;

      gtag('event', 'Clic', { 'event_category': 'Reserva de Hora', 'event_label': 'Paso3:Identificación-Buscar' });



    }, err => {
      this.utils.mDialog("Error", "No se ha podido consultar al paciente, intente nuevamente", "message");
    })




  }

  eventEnter(event, action) {
    if (event.keyCode == 13) {

      switch (action) {

        case 'buscarPaciente':
          this.setFormatRut();
          this.buscarPaciente();
          break;

        case 'procesarPaciente':
          this.procesarPaciente();
          break;

        case 'guardarPaciente':
          this.guardarPaciente()
          break;
      }
    }
  }

  getPaises() {
    this.agendaService.getPaises().then(data => {
      this.paises = data['paises'];
      const pais = data['paises'].filter(item => {
        if (item.nombre.toLowerCase().includes('chile')) {
          return item;
        }
      });
      if (pais.length === 1) {
        this.pacienteForm.patchValue({ dir_pais: pais[0] });
        this.getRegiones('CL', false);
      }
    });
  }

  getRegiones(codPais = 'CL', fromSelectChange = true) {
    this.agendaService.getRegiones(codPais).then(data => {
      this.utils.hideProgressBar();
      this.regiones = this.orderPipe.transform(data['regiones'], 'nombre', false, true);
      if (!fromSelectChange) {
        const rm = data['regiones'].filter(item => {
          if (item.nombre.toLowerCase().includes('metropolitana')) {
            return item;
          }
        });
        if (rm.length === 1) {
          this.pacienteForm.patchValue({ dir_region: rm[0] });
          this.getComunas({ value: rm[0] });
        }
      }
    });
  }

  getComunas(e) {
    this.pacienteForm.patchValue({ dir_comuna: '' });
    this.agendaService.getComunas(e.value.id).then(res => {
      setTimeout(()=>{
        this.utils.hideProgressBar();
      },2000)
      this.comunas = this.orderPipe.transform(res['comunas'], 'nombre', false, true);
    });
  }

  guardarPaciente() {
    this.pacienteForm.patchValue({
      identificador: this.busquedaPaciente.documento,
      tipo_identificador: this.busquedaPaciente.tipoDocumento,
      pais_emisor_identificador: 'CL'
    })
    if (this.pacienteForm.valid) {

      let data = this.pacienteForm.getRawValue();
      if (!this.utils.validateEmail(data.email)) {
        this.utils.mDialog("Error", "El correo del Paciente tiene formato inválido.", "message");
        return false;
      }

      if (String(data.fono_movil.trim()).length != 11) {
        this.utils.mDialog("Error", "Número de teléfono inválido. Debe tener 11 numeros.", "message");
        return false;
      }

      let f: any = this.utils.trDateStr(data['fecha_nacimiento'], 'json')
      data['fecha_nacimiento'] = f['year'] + "-" + f['month'] + "-" + f['day'];
      data['previsionObj'] = data['prevision'];
      data['prevision'] = (data['prevision']) ? data['prevision']['idPlan'] : null;
      data['fono_movil'] = '+' + data['fono_movil'];
      data['dir_region'] = data['dir_region']['id'];
      data['dir_pais'] = data['dir_pais']['id'];

      this.agendaService.postPaciente(data).subscribe(res => {
        if ((res['statusCode'] && res['statusCode'] == 'OK') || (res['statusCod'] && res['statusCod'] == 'OK')) {
          this.limpiarFormulario();
          this.busquedaPaciente.documento = data['identificador'];
          this.busquedaPaciente.documentoFormateado = this.utils.formatRut(data['identificador']);
          this.busquedaPaciente.tipoDocumento = data['tipo_identificador']
          this.busquedaPaciente.prevision = data['previsionObj'];
          if(this.busquedaInicial.gtagActionName){
            gtag('event', this.busquedaInicial.gtagActionName, { 'event_category': this.busquedaInicial.gtagName, 'event_label': `j.4) Registro de Nuevo Paciente`, 'value': '0' });
            gtag('event', this.busquedaInicial.gtagActionEspProf, { 'event_category': this.busquedaInicial.gtagNameEsp, 'event_label': `j.4) Registro de Nuevo Paciente`, 'value': '0' });
  
          }

          this.buscarPaciente();
          this.resetDir();
        } else {
          this.utils.mDialog("Error", "No se pudo guardar la información requerida. Detalle: " + res['statusDesc'], "message")
        }
      })
    }
  }

  limpiarFormulario(type = null) {

    this.resetDir();

    if (!type) {
      try {
        this.pacienteForm.reset();
        this.formDirective.resetForm();
      } catch (error) {
      }
    }

    this.paciente = null;
    this.findPaciente = false;
    this.busquedaPaciente = {
      tipoDocumento: "RUN",
      documento: null,
      documentoFormateado: null,
      prevision: null,
      telefono: null,
      correo: null
    }

    this.listaEsperaSeleccion = {
      horario: null,
      centro: null,
      profesional: null
    }
  }

  procesarDatosBusqCliente() {

    let hasUpd = { telefono: false, correo: false };
    let dataUpd = { idPRM: this.paciente.id };

    if (this.paciente.email !== this.busquedaPaciente.correo) {
      dataUpd['correo'] = this.busquedaPaciente.correo;
      hasUpd['correo'] = true;
    }

    if (this.paciente.numeroTelefonoPrincipal !== this.busquedaPaciente.telefono) {
      dataUpd['telefono'] = '+' + parseInt(this.busquedaPaciente.telefono);
      hasUpd['telefono'] = true;
    }

    return { dataUpd, hasUpd };

  }

  updDatosBusqCliente(data) {
    return new Promise((resolve, reject) => {
      this.agendaService.putPaciente(data).subscribe(res => {
        resolve(true)
      })
    })
  }

  async procesarPaciente() {

    if (this.busquedaPaciente.documento && this.busquedaPaciente.prevision && this.busquedaPaciente.telefono && this.busquedaPaciente.correo) {

      let updInfo = this.procesarDatosBusqCliente();

      if (!this.utils.validateEmail(this.busquedaPaciente.correo) && updInfo['hasUpd']['correo']) {
        this.utils.mDialog("Error", "El correo del Paciente tiene formato inválido.", "message");
        return false;
      }

      if (String(parseInt(this.busquedaPaciente.telefono)).trim().length != 11 && updInfo['hasUpd']['telefono']) {
        this.utils.mDialog("Error", "Número de teléfono inválido. Debe tener 11 numeros.", "message");
        return false;
      }

      if (updInfo['hasUpd']['correo'] || updInfo['hasUpd']['telefono']) {
        let respUpdB = await this.updDatosBusqCliente(updInfo['dataUpd']);
      }

      this.paciente['adicional'] = this.busquedaPaciente;
      let duracion = this.calendario.cupo.duracion;
      let fecha: any = this.utils.toLocalScl(this.calendario.cupo.fechaHora, this.calendario.cupo.compensacion);
      let fechaTermino = new Date(fecha);
      fechaTermino.setMinutes(fechaTermino.getMinutes() + duracion);
      let fTermino = this.utils.toLocalScl(fechaTermino, this.calendario.cupo.compensacion);

      this.reglasValidacion(fecha, fTermino).then(async data => {

        if (!data['listaTiposDeCita'] || !data['listaTiposDeCita'][0]) {
          if (data['statusCod'] && data['statusCod'].toUpperCase() == 'ERR') {
            await this.errReserva(data['usrMsg']);
          } else {
            this.utils.mDialog("Error", "No se ha podido verificar la Disponibilidad del Cupo. Intente nuevamente.", "message");
          }
          return false;
        }

        this.agendaService.getMensajes({
          ResourceId: this.calendario.recurso.id,
          CenterId: this.calendario.cupo.centro.id,
          ServiceId: this.busquedaInicial.especialidad.idServicio,
          Channel: 'PatientPortal'
        }).subscribe(async dt => {

          let action: any = '';
          let mensajeDeRegla = '';
          let mensajes = '';

          const mejs = (dt && dt['mensajes']) ? dt['mensajes'] : [];

          data['reglas'].forEach(item => {
            mensajeDeRegla += `<div style="margin-botton:15px;">${item.nombre}.</div>`;
          });

          mejs.forEach(item => {
            mensajes += item.mensaje.contenido;
          });


          if (data['reservable']) {

            if (mensajeDeRegla) {
              action = await this.errReserva(mensajeDeRegla + mensajes, 'CONTINUAR');
            } else {
              action = "CONTINUAR";
            }

          } else {

            if (mensajeDeRegla) {

              action = await this.errReserva(mensajeDeRegla);

              gtag('event', this.busquedaInicial.gtagActionName, { 'event_category': this.busquedaInicial.gtagName, 'event_label': `j.5) Cupo No Reservable / Mensajes de Reglas`, 'value': '0' });
              gtag('event', this.busquedaInicial.gtagActionEspProf, { 'event_category': this.busquedaInicial.gtagNameEsp, 'event_label': `j.5) Cupo No Reservable / Mensajes de Reglas`, 'value': '0' });

            } else {

              gtag('event', this.busquedaInicial.gtagActionName, { 'event_category': this.busquedaInicial.gtagName, 'event_label': `j.5) Cupo No Reservable`, 'value': '0' });
              gtag('event', this.busquedaInicial.gtagActionEspProf, { 'event_category': this.busquedaInicial.gtagNameEsp, 'event_label': `j.5) Cupo No Reservable`, 'value': '0' });


              action = await this.errReserva('El cupo seleccionado ya no se encuentra disponible. ¿Que desea hacer?');

            }


          }

          if (action === 'CONTINUAR') {

            if (this.busquedaInicial.gtagActionName) {
              gtag('event', this.busquedaInicial.gtagActionName, { 'event_category': this.busquedaInicial.gtagName, 'event_label': `j) ETAPA 3 IDENTIFICACIÓN COMPLETADA`, 'value': '0' });
              gtag('event', this.busquedaInicial.gtagActionEspProf, { 'event_category': this.busquedaInicial.gtagNameEsp, 'event_label': `j) ETAPA 3 IDENTIFICACIÓN COMPLETADA`, 'value': '0' });

            }

            let mensajes = (dt && dt['mensajes']) ? dt['mensajes'] : [];
            this.datosPaciente.emit({
              busquedaPaciente: this.busquedaPaciente,
              paciente: this.paciente,
              reglas: data['reglas'],
              valorConvenio: data['valorConvenio'],
              reservable: data['reservable'],
              mensajes: mensajes,
              tipoCita: data['listaTiposDeCita'][0],
              direccionCentro: (data['listaCentros'] && data['listaCentros'][0] && data['listaCentros'][0]['direccion']) ? data['listaCentros'][0]['direccion'] : null
            });

            if (this.listaEspera) {
              if (this.busquedaInicial.gtagActionName) {
                gtag('event', this.busquedaInicial.gtagActionName, { 'event_category': this.busquedaInicial.gtagName, 'event_label': `j.1) Inscripción en Lista de Espera`, 'value': '0' });
                gtag('event', this.busquedaInicial.gtagActionEspProf, { 'event_category': this.busquedaInicial.gtagNameEsp, 'event_label': `j.1) Inscripción en Lista de Espera`, 'value': '0' });

              }
              gtag('event', 'Identificación (Lista de Espera)', { 'event_category': 'Reserva de Hora | Identificación', 'event_label': 'Paso3:Identificación-Siguiente' });
            }

            if (this.isProcedimiento) {
              if (this.busquedaInicial.gtagActionName) {
                gtag('event', this.busquedaInicial.gtagActionName, { 'event_category': this.busquedaInicial.gtagName, 'event_label': `j.2) Procedimiento Médico Solicitado`, 'value': '0' });
                gtag('event', this.busquedaInicial.gtagActionEspProf, { 'event_category': this.busquedaInicial.gtagNameEsp, 'event_label': `j.2) Procedimiento Médico Solicitado`, 'value': '0' });
              }
              gtag('event', 'Identificación (Procedimiento)', { 'event_category': 'Reserva de Hora | Identificación', 'event_label': 'Paso3:Identificación-Siguiente' });
            }

            if (!this.listaEspera && !this.isProcedimiento) {
              gtag('event', 'Paso 03', { 'event_category': 'Reserva de Hora | Identificación', 'event_label': 'Confirmar-Reserva' });

            }

          }


        });

      }).catch(async err => {

        if (err === 'no-reservable') {
          await this.errReserva('El cupo seleccionado no se encuentra disponible. Seleccione otra hora.');
        } else {
          await this.errReserva(err['usrMsg']);
        }

      });

    } else {

      if (!this.busquedaPaciente.documento || this.busquedaPaciente.documento == '') {
        this.utils.mDialog("Error", "Debe ingresar el número de documento.", "message");
        return false;
      }

      if (!this.busquedaPaciente.prevision) {
        this.utils.mDialog("Error", "Debe indicar la previsión.", "message");
        return false;
      }

      if (!this.busquedaPaciente.telefono || this.busquedaPaciente.telefono == '') {
        this.utils.mDialog("Error", "Debe ingresar el teléfono.", "message");
        return false;
      }

      if (!this.busquedaPaciente.correo || this.busquedaPaciente.correo == '') {
        this.utils.mDialog("Error", "Debe ingresar el correo.", "message");
        return false;
      }
    }

    gtag('event', 'Clic', { 'event_category': 'Reserva de Hora', 'event_label': 'Paso3:Identificación-Siguiente' });

  }

  getFechasInicioTermino() {
    let duracion = this.calendario.cupo.duracion;
    let fecha: any = this.utils.toLocalScl(this.calendario.cupo.fechaHora, this.calendario.cupo.compensacion);
    let fechaTermino = new Date(fecha);
    fechaTermino.setMinutes(fechaTermino.getMinutes() + duracion);
    let fTermino = this.utils.toLocalScl(fechaTermino, this.calendario.cupo.compensacion);

    return {
      fecha,
      fTermino
    }
  }

  async cambioPrevision() {

    try {

      let duracion = this.calendario.cupo.duracion;
      let fecha: any = this.utils.toLocalScl(this.calendario.cupo.fechaHora, this.calendario.cupo.compensacion);
      let fechaTermino = new Date(fecha);
      fechaTermino.setMinutes(fechaTermino.getMinutes() + duracion);
      let fTermino = this.utils.toLocalScl(fechaTermino, this.calendario.cupo.compensacion);
      const data = {
        planDeSalud: this.busquedaPaciente.prevision.idPlan,
        idPRM: this.paciente.id
      }

      const resp = await Promise.all([this.reglasValidacion(fecha, fTermino), this.updDatosBusqCliente(data)]);

      this.calendario.cupo.valorConvenio = resp[0]['valorConvenio'] ? resp[0]['valorConvenio'] : 0;

    } catch (err) {

    }


  }

  reglasValidacion(fecha, fTermino) {

    return new Promise((resolve, reject) => {

      this.agendaService.geReglasValidacion({

        fechaInicio: fecha,
        fechaTermino: fTermino,
        idCentro: this.calendario.cupo.centro.id,
        idRecurso: this.calendario.recurso.id,
        idServicio: this.busquedaInicial.especialidad.idServicio,
        idPaciente: this.paciente.id,
        idDisponibilidad: this.calendario.cupo.disponibilidad.id,
        idProfesional: this.calendario.recurso.id,
        idPlanSalud: this.busquedaPaciente.prevision.id

      }).subscribe(data => {

        let reglas: any = [];
        let valorConvenio: any = false;
        let reservable: any = false;

        try {

          reglas = data['listaMensajesDeRegla'];
          valorConvenio = data['listaCupos'][0]['valorConvenio'];
          reservable = data['listaCupos'][0]['reservable']['reservable'];

        } catch (err) {

        }

        //}

        resolve({
          ...data,
          reglas,
          valorConvenio,
          reservable,
        });

      }, err => {
        reject(err);
      })
    })
  }

  setFormatRut() {
    this.busquedaPaciente.documentoFormateado = (this.busquedaPaciente.documentoFormateado) ?
      this.busquedaPaciente.documentoFormateado.trim() : null;

    if (this.busquedaPaciente.tipoDocumento == 'RUN') {
      let rut = this.busquedaPaciente.documentoFormateado;
      if (rut && rut != "") {
        let rutPuntos = this.utils.formatRut(rut)
        this.busquedaPaciente.documentoFormateado = rutPuntos
        this.busquedaPaciente.documento = this.utils.replaceAll(rutPuntos, ".", "");
      }
    } else {
      this.busquedaPaciente.documento = this.busquedaPaciente.documentoFormateado;
    }

  }

  restoreFormatRut() {
    if (this.busquedaPaciente.documentoFormateado && this.busquedaPaciente.documentoFormateado != "" && this.busquedaPaciente.tipoDocumento == 'RUN') {
      let documento = this.busquedaPaciente.documentoFormateado.trim();
      documento = this.utils.replaceAll(documento, ".", "");
      documento = this.utils.replaceAll(documento, "-", "");
      this.busquedaPaciente.documentoFormateado = documento;
    }
  }

  errReserva(message, type = 'ONLY_MESSAGE') {

    return new Promise((resolve, reject) => {

      let msg = (message) ? message : 'Se ha producido un error. ¿Que desea hacer?';

      let dialogRef = this.dialog.open(ErrorReservaComponent, {
        width: '640px',
        data: { message: msg, type },
        autoFocus: false,
        disableClose: true
      });

      dialogRef.componentInstance.dialogEvent.subscribe((result) => {

        switch (result) {

          case 'BUSQUEDA':
            this.utils.setReloadBusqueda();
            resolve('BUSQUEDA');
            break;

          case 'INICIO':
            this.utils.clearReserva();
            resolve('INICIO');
            break;

          case 'CONTINUAR':
            resolve('CONTINUAR');
            break;

        }

        this.dialog.closeAll();

      });

    });


  }

  getCentros(idServicio, idArea, idProfesional) {

    this.agendaService.getCentrosByEspecialidad(idServicio, idArea, idProfesional).subscribe(res => {

      res['centros'].forEach((val, key) => {

        ENV.idCentrosNoDisponibles.forEach((v, k) => {
          if (val['idCentro'] == v) {
            res['centros'].splice(key, 1);
          }
        });
      });

      res['centros'] = this.orderPipe.transform(res['centros'], 'nombre');
      this.centros = res['centros'];

      if (this.centros.length === 1) {
        this.listaEsperaSeleccion.centro = this.centros[0];
      }
      setTimeout(() => {
        this.utils.hideProgressBar();
      }, 3000);
    });

  }

  getProfesionales(idServicio) {
    const query = `idServicio=${idServicio}`
    this.agendaService.getProfesionalesByQuery(query).subscribe(res => {
      if (res['profesionales'] && res['profesionales'].length > 0) {
        this.profesionales = this.orderPipe.transform(res['profesionales'], 'nombreProfesional');
      } else {
        this.profesionales = [];
      }
      this.profesionales.forEach((val, key) => {
        if (val['idProfesional'] === this.listaEspera.id) {
          this.listaEsperaSeleccion.profesional = val;
          this.selectProfesional({ value: val });
        }
      });

      setTimeout(() => {
        this.utils.hideProgressBar();
      }, 3000);
    });
  }

  selectProfesional(dt) {

    let idProfesional = null;

    if (dt.value !== 'NA') {
      idProfesional = dt.value.idProfesional;
      this.listaEspera.nombre = dt.value.nombreProfesional;
      this.listaEsperaSeleccion.centro = null;
    }

    const idServicio = this.busquedaInicial.especialidad.idServicio;
    const area = this.busquedaInicial.area.id;

    this.getCentros(idServicio, area, idProfesional);

  }

  async procesarListaDeEspera() {

    if (!this.listaEsperaSeleccion.profesional) {
      this.utils.mDialog("Datos Incompletos", "Debe seleccionar el profesional de preferencia.", "message");
      return false;
    }

    if (!this.listaEsperaSeleccion.horario) {
      this.utils.mDialog("Datos Incompletos", "Debe seleccionar el horario de preferencia.", "message");
      return false;
    }

    if (!this.listaEsperaSeleccion.centro) {
      this.utils.mDialog("Datos Incompletos", "Debe seleccionar el Centro Médico de preferencia.", "message");
      return false;
    }

    let data = {
      intervaloPreferido: this.listaEsperaSeleccion.horario,
      idPaciente: this.paciente.id,
      idServicio: this.busquedaInicial.especialidad.idServicio,
      //  fechaLimite: (new Date()).toISOString().split("T")[0]
    }

    if (this.listaEsperaSeleccion.profesional !== 'NA') {
      data['idRecurso'] = this.listaEsperaSeleccion.profesional.idProfesional;
    }

    if (this.listaEsperaSeleccion.centro !== 'NA') {
      data['idCentro'] = this.listaEsperaSeleccion.centro.idCentro;
    }

    this.agendaService.postListaDeEspera(data).then(res => {
      if (res['statusCod'] === 'OK') {
        this.confirmacionListaEspera.emit({ datosListaEspera: this.listaEsperaSeleccion, paciente: this.paciente });
      } else {
        const msg = (res['usrMsg']) ? res['usrMsg'] : 'Se ha producido un error interno. Intente más tarde nuevamente.'
        this.utils.mDialog("Notificación", msg, 'message');
      }
    });



  }

  async procesarProcedimiento() {

    if (!this.procedimientoSeleccion.horario) {
      this.utils.mDialog("Datos Incompletos", "Debe seleccionar el horario de preferencia.", "message");
      return false;
    }

    if (!this.procedimientoSeleccion.centro) {
      this.utils.mDialog("Datos Incompletos", "Debe seleccionar el Centro Médico de preferencia.", "message");
      return false;
    }

    if (!this.procedimientoSeleccion.celularPref && !this.procedimientoSeleccion.correoPref) {
      this.utils.mDialog("Error", "Debe seleccionar un medio de contacto de preferencia.", "message");
      return false;
    }

    if (!this.procedimientoSeleccion.archivo) {
      this.utils.mDialog("Error", "Debe adjuntar la orden médica.", "message");
      return false;
    }

    if (!this.procedimientoSeleccion.prevision) {
      this.utils.mDialog("Error", "Debe seleccionar la previsión.", "message");
      return false;
    }

    const data = {
      idCentro: this.procedimientoSeleccion.centro.idCentro,
      idServicio: this.busquedaInicial.especialidad.idServicio,
      idPaciente: this.paciente.id,
      idPrevision: this.procedimientoSeleccion.prevision.id,
      idPreferenciaContacto: this.procedimientoSeleccion.celularPref ? '0' : '1',
      horarioPreferencia: this.procedimientoSeleccion.horario === 'AM' ? '0' : '1',
      presupuesto: this.procedimientoSeleccion.generarPresupuesto,
      ordenMedica: this.procedimientoSeleccion.archivo.file64
    }

    this.agendaService.postProcedimiento(data).then(res => {
      if (res['statusCod'] && res['statusCod'] === 'OK') {
        this.confirmacionProcedimiento.emit({ datosProcedimiento: this.procedimientoSeleccion, paciente: this.paciente });
      } else {
        const msj = res['usrMsg'] ? res['usrMsg'] : 'No se ha podido guardar la información. Intente más tarde.'
        this.utils.mDialog('Error', msj, 'message');
      }
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

    this.datasUpload = []

    try {

      for await (let a of Object.keys(files)) {
        await this.prepareFile(files[a]);
      }
      this.procedimientoSeleccion.archivo = this.datasUpload[0];
      this.resetInputFile();

    } catch (err) {

      return;

    }

  }

  async prepareFile(file: any) {

    let reader = new FileReader();
    let size = Math.round((file['size'] / 1000) * 100) / 100;

    return new Promise((resolve, reject) => {

      if (size <= 5000) {

        reader.readAsDataURL(file);
        reader.onload = () => {

          let file64 = String(reader.result).split(";");
          let namesplit = file['name'].split(".");

          let data = {
            name: file['name'],
            size: size + "KB",
            displayName: `${namesplit[0].substring(0, 16)}....${namesplit[1]}`,
            mimetype: file64[0].split(":")[1],
            file64: file64[1].split(",")[1],
            file: String(reader.result)
          }

          if (this.validarMimetype(data.mimetype)) {
            this.datasUpload.push(data);
            resolve(true);
          } else {
            reject(false);
            this.utils.mDialog("Error", "El tipo de archivo no es permitido.", "message");
          }

        };

      } else {
        this.utils.mDialog("Error", "El tamaño máximo permitido del archivo es 5MB.", "message");
      }

    });

  }

  validarMimetype(mimeType) {

    let isValid = false;

    switch (mimeType) {
      case 'image/png': isValid = true; break;
      case 'image/jpeg': isValid = true; break;
      case 'image/gif': isValid = true; break;
      case 'application/pdf': isValid = true; break;
    }

    return isValid;
  }

  borrarArchivo() {
    this.procedimientoSeleccion.archivo = null;
  }

  changeContacto(event, source) {

    const checked = event.checked;

    if (source === 'phone') {
      this.procedimientoSeleccion.celularPref = checked;
      this.procedimientoSeleccion.correoPref = !checked;
    } else {
      this.procedimientoSeleccion.celularPref = !checked;
      this.procedimientoSeleccion.correoPref = checked;
    }

  }


}
