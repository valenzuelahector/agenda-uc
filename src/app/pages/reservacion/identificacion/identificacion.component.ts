import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { AgendaAmbulatoriaService } from 'src/app/services/agenda-ambulatoria.service';
import { FormControl, FormGroup, Validators, FormGroupDirective } from '@angular/forms'
import gtag, { install } from 'ga-gtag';

@Component({
  selector: 'app-identificacion',
  templateUrl: './identificacion.component.html',
  styleUrls: ['./identificacion.component.scss']
})
export class IdentificacionComponent implements OnInit {

  @Output() datosPaciente: EventEmitter<any> = new EventEmitter();
  @Input() busquedaInicial: any;
  @Input() calendario: any;

  public today: Date = new Date();
  public paciente: any;
  public findPaciente: boolean = false;
  public planesSalud: any = [];

  public infoAdicionaPaciente: any = {
    telefono: null,
    correo: null
  }

  public busquedaPaciente: any = {
    tipoDocumento: "RUN",
    documento: null,
    documentoFormateado: null,
    prevision: null,
    telefono: null,
    correo: null
  }

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
    dir_calle: new FormControl(''),
    dir_numero: new FormControl(''),
    dir_pais: new FormControl(''),
  });

  constructor(
    public utils: UtilsService,
    public agendaService: AgendaAmbulatoriaService
  ) {

  }

  ngOnInit() {
    //this.getPlanesSalud();

    this.utils.resetInfoPaciente.subscribe(r => {
      this.limpiarFormulario(true);
    })
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
          })
        })

        this.planesSalud = data['companias'];
      }
    })
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
        this.getPlanesSalud(this.paciente.id);
      } else {
        this.getPlanesSalud(null, this.busquedaPaciente);
      }
      this.findPaciente = true;
    })


    gtag('event', 'Clic', { 'event_category': 'Reserva de Hora', 'event_label': 'Paso3:Identificación-Buscar' });

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
      
      this.agendaService.postPaciente(data).subscribe(res => {
        if ((res['statusCode'] && res['statusCode'] == 'OK') || (res['statusCod'] && res['statusCod'] == 'OK')) {
          this.limpiarFormulario();
          this.busquedaPaciente.documento = data['identificador'];
          this.busquedaPaciente.documentoFormateado = this.utils.formatRut(data['identificador']);
          this.busquedaPaciente.tipoDocumento = data['tipo_identificador']
          this.busquedaPaciente.prevision = data['previsionObj'];
          this.buscarPaciente();
        } else {
          this.utils.mDialog("Error", "No se pudo guardar la información requerida. Detalle: " + res['statusDesc'], "message")
        }
      })
    }
  }

  limpiarFormulario(type = null) {

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
  updDatosBusqCliente(data){
    return new Promise((resolve, reject) => {
      this.agendaService.putPaciente(data).subscribe( res => {
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

      if(updInfo['hasUpd']['correo'] || updInfo['hasUpd']['telefono']){
        let respUpdB = await this.updDatosBusqCliente(updInfo['dataUpd']);
      }

      this.paciente['adicional'] = this.busquedaPaciente;
      let duracion = this.calendario.cupo.duracion;
      let fecha: any = this.utils.toLocalScl(this.calendario.cupo.fechaHora, this.calendario.cupo.compensacion);
      let fechaTermino = new Date(fecha);      
      fechaTermino.setMinutes(fechaTermino.getMinutes() + duracion);
      let fTermino = this.utils.toLocalScl(fechaTermino, this.calendario.cupo.compensacion);

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

        if(!data['listaTiposDeCita'] || !data['listaTiposDeCita'][0]){
          this.utils.mDialog("Error", "No se ha podido verificar la Disponibilidad del Cupo. Intente nuevamente.", "message");
          return false;
        }

        if (data['listaMensajesDeRegla'] && data['listaCupos'][0]) {
          reglas = data['listaMensajesDeRegla'];
          valorConvenio = data['listaCupos'][0]['valorConvenio'];
          reservable = data['listaCupos'][0]['reservable']['reservable']
        }

        this.agendaService.getMensajes({
          ResourceId: this.calendario.recurso.id,
          CenterId: this.calendario.cupo.centro.id,
          ServiceId: this.busquedaInicial.especialidad.idServicio,
          Channel: 'PatientPortal'
        }).subscribe(dt => {

          let mensajes = (dt && dt['mensajes']) ? dt['mensajes'] : [];
          this.datosPaciente.emit({ 
            paciente: this.paciente, 
            reglas: reglas, 
            valorConvenio: valorConvenio, 
            reservable: reservable, 
            mensajes: mensajes ,
            tipoCita: data['listaTiposDeCita'][0],
            direccionCentro: (data['listaCentros'] && data['listaCentros'][0] && data['listaCentros'][0]['direccion']) ? data['listaCentros'][0]['direccion'] : null
          });

        })

      })

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

}
