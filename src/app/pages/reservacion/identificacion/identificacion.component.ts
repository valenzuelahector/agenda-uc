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
    prevision: null,
    telefono: null,
    correo: null
  }

  @ViewChild("formDirective") formDirective: FormGroupDirective;

  public pacienteForm = new FormGroup({
    identificador: new FormControl('', [Validators.required]),
    nombre: new FormControl('', Validators.required),
    apellido_paterno: new FormControl('', Validators.required),
    apellido_materno: new FormControl(''),
    email: new FormControl('', [Validators.email]),
    sexo: new FormControl('', Validators.required),
    fecha_nacimiento: new FormControl('', Validators.required),
    fono_movil: new FormControl('', Validators.required),
    tipo_identificador: new FormControl('', Validators.required),
    pais_emisor_identificador: new FormControl('', Validators.required),
    prevision: new FormControl('', Validators.required),
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
    this.getPlanesSalud();

    this.utils.resetInfoPaciente.subscribe(r => {
      console.log("sssss")
      this.limpiarFormulario(true);
    })
  }

  get revPacienteForm() {
    return this.pacienteForm.controls;
  }

  getPlanesSalud() {
    this.agendaService.getPlanesSalud().subscribe(data => {
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
      this.utils.mDialog("Error", "El RUN " + this.busquedaPaciente.documento + " no es válido. Verifique e intente nuevamente.", "message");
      return false;
    }

    this.agendaService.getPaciente(this.busquedaPaciente.documento, this.busquedaPaciente.tipoDocumento).subscribe(res => {
      if (res['listaPacientes'] && res['listaPacientes'][0]) {
        this.paciente = res['listaPacientes'][0];
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


      let f: any = this.utils.trDateStr(data['fecha_nacimiento'], 'json')
      data['fecha_nacimiento'] = f['year'] + "-" + f['month'] + "-" + f['day'];
      data['previsionObj'] = data['prevision'];
      data['prevision'] = data['prevision']['idPlan'];
      this.agendaService.postPaciente(data).subscribe(res => {
        if ((res['statusCode'] && res['statusCode'] == 'OK') || (res['statusCod'] && res['statusCod'] == 'OK')) {
          this.busquedaPaciente.correo = data['email'];
          this.busquedaPaciente.prevision = data['previsionObj'];
          this.busquedaPaciente.telefono = data['fono_movil'];
          this.buscarPaciente();
          this.limpiarFormulario();
          this.utils.mDialog("Mensaje", "Paciente creado correctamente", "message");

        } else {
          this.utils.mDialog("Error", "No se pudo guardar la información requerida. Detalle: " + res['statusDesc'], "message")
        }
      })
    }
  }

  limpiarFormulario(type = null) {
    if (!type) {
      this.pacienteForm.reset();
      this.formDirective.resetForm();
    }

    this.paciente = null;
    this.findPaciente = false;
    this.busquedaPaciente = {
      tipoDocumento: "RUN",
      documento: null,
      prevision: null,
      telefono: null,
      correo: null
    }
  }

  procesarPaciente() {
    if (this.busquedaPaciente.documento && this.busquedaPaciente.tipoDocumento && this.busquedaPaciente.telefono) {
      
      if(!this.utils.validateEmail(this.busquedaPaciente.correo)){
        this.utils.mDialog("Error", "El correo del Paciente tiene formato inválido.", "message");
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
        idProfesional: this.calendario.cupo.idStrRecProfesional
        
      }).subscribe(data => {
        this.datosPaciente.emit({paciente: this.paciente, reglas: data['listaMensajesDeRegla'], valorConvenio: data['listaCupos'][0]['valorConvenio']});
      })
   
    } else {
      this.utils.mDialog("Error", "Debe completar los datos que se solicitan.", "message")
    }

  }
}
