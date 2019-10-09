import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { AgendaAmbulatoriaService } from 'src/app/services/agenda-ambulatoria.service';
import { FormControl, FormGroup, Validators, FormGroupDirective } from '@angular/forms'

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

  @ViewChild("formDirective") formDirective: FormGroupDirective;

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
    prevision: new FormControl('',),
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
        this.getPlanesSalud(this.paciente.id);
      }else{
        this.getPlanesSalud(null, this.busquedaPaciente);
      }
      this.findPaciente = true;
    })
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
      
      this.agendaService.postPaciente(data).subscribe(res => {
        if ((res['statusCode'] && res['statusCode'] == 'OK') || (res['statusCod'] && res['statusCod'] == 'OK')) {
          this.limpiarFormulario();
          this.busquedaPaciente.documento = data['identificador'];
          this.busquedaPaciente.documentoFormateado = this.formatRut(data['identificador']);
          this.busquedaPaciente.tipoDocumento = data['tipo_identificador']
          this.busquedaPaciente.correo = data['email'];
          this.busquedaPaciente.prevision = data['previsionObj'];
          this.busquedaPaciente.telefono = data['fono_movil'];
          this.buscarPaciente();
          this.utils.mDialog("Mensaje", "Paciente creado correctamente", "message");

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

  procesarPaciente() {

    if (this.busquedaPaciente.documento && this.busquedaPaciente.prevision && this.busquedaPaciente.telefono && this.busquedaPaciente.correo) {

      if (!this.utils.validateEmail(this.busquedaPaciente.correo)) {
        this.utils.mDialog("Error", "El correo del Paciente tiene formato inválido.", "message");
        return false;
      }

      if (String(this.busquedaPaciente.telefono).trim().length != 11){
        this.utils.mDialog("Error", "Número de teléfono inválido. Debe tener 11 numeros.", "message");
        return false;
      }

      this.paciente['adicional'] = this.busquedaPaciente;

      let duracion = this.calendario.cupo.duracion;
      let fecha: any = this.utils.trDateStr(this.calendario.cupo.fechaHora, 'n');
      let fechaTermino = new Date(fecha);      
      fechaTermino.setMinutes(fechaTermino.getMinutes() + duracion);

      let fTermino = this.utils.trDateStr(fechaTermino, 'n');

      this.agendaService.geReglasValidacion({

        fechaInicio: fecha,
        fechaTermino: fTermino,
        idCentro: this.calendario.cupo.idStrCentro,
        idRecurso: this.calendario.recurso.id,
        idServicio: this.busquedaInicial.especialidad.idServicio,
        idPaciente: this.paciente.id,
        idDisponibilidad: this.calendario.cupo.idStrDisponibilidad,
        idProfesional: this.calendario.cupo.idStrRecProfesional,
        idPlanSalud: this.busquedaPaciente.prevision.id

      }).subscribe(data => {
        
        let reglas:any = [];
        let valorConvenio:any = false;
        let reservable:any = false;

        if(data['listaMensajesDeRegla'] && data['listaCupos'][0]){
          reglas = data['listaMensajesDeRegla'];
          valorConvenio = data['listaCupos'][0]['valorConvenio'];
          reservable = data['listaCupos'][0]['reservable']['reservable']
        }

        this.agendaService.getMensajes({
          ResourceId: this.calendario.recurso.id,
          CenterId: this.calendario.cupo.idStrCentro,
          ServiceId: this.busquedaInicial.especialidad.idServicio,
          Channel: 'PatientPortal'
        }).subscribe( dt => {

          let mensajes = (dt && dt['mensajes']) ? dt['mensajes'] : [];
          this.datosPaciente.emit({ paciente: this.paciente, reglas: reglas, valorConvenio: valorConvenio, reservable: reservable, mensajes: mensajes });

        })
         
      })

    } else {

      if (!this.busquedaPaciente.documento || this.busquedaPaciente.documento == '' ){
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

  }

  setFormatRut() {
    this.busquedaPaciente.documentoFormateado = (this.busquedaPaciente.documentoFormateado) ?
      this.busquedaPaciente.documentoFormateado.trim() : null;

    if (this.busquedaPaciente.tipoDocumento == 'RUN'){
      let rut = this.busquedaPaciente.documentoFormateado;
      if (rut && rut != "") {
        let rutPuntos = this.formatRut(rut)
        this.busquedaPaciente.documentoFormateado = rutPuntos
        this.busquedaPaciente.documento = this.utils.replaceAll(rutPuntos, ".", "");
      }
    }else{
      this.busquedaPaciente.documento = this.busquedaPaciente.documentoFormateado;
    }
    
  }

  formatRut(rut) {
    rut = rut.toUpperCase();
    let actual = rut.replace(/^0+/, "");
    if (actual != '' && actual.length > 1) {
      var sinPuntos = actual.replace(/\./g, "");
      var actualLimpio = sinPuntos.replace(/-/g, "");
      var inicio = actualLimpio.substring(0, actualLimpio.length - 1);
      var rutPuntos = "";
      var i = 0;
      var j = 1;
      for (i = inicio.length - 1; i >= 0; i--) {
        var letra = inicio.charAt(i);
        rutPuntos = letra + rutPuntos;
        if (j % 3 == 0 && j <= inicio.length - 1) {
          rutPuntos = "." + rutPuntos;
        }
        j++;
      }
      var dv = actualLimpio.substring(actualLimpio.length - 1);
      rutPuntos = rutPuntos + "-" + dv;
    }

    return rutPuntos;

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
