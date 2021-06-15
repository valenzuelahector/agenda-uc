import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { AgendaAmbulatoriaService } from 'src/app/services/agenda-ambulatoria.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-registro-usuario',
  templateUrl: './registro-usuario.component.html',
  styleUrls: ['./registro-usuario.component.scss']
})
export class RegistroUsuarioComponent implements OnInit {

  documento = null;
  today = new Date();
  planesSalud:any = [];
  rutConfirmado = false;
  loading = false;
  displayInputCode = false;
  codeInput ;
  codeReady = false;
  correo;

  public mainForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    identificador: new FormControl(''),
    tipo_identificador: new FormControl('RUN'),
    pais_identificador: new FormControl('CL'),
    nombre: new FormControl('', [Validators.required]),
    apellido_paterno: new FormControl('', [Validators.required]),
    apellido_materno: new FormControl(''),
    fecha_nacimiento: new FormControl('', [Validators.required]),
    sexo: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    fono_movil: new FormControl('', [Validators.required]),
    prevision: new FormControl('', [Validators.required]),
    origen_registro: new FormControl('portal_web'),
    marca_email: new FormControl(true)
  });

  constructor(
    public utils: UtilsService,
    public agendaService: AgendaAmbulatoriaService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    /*this.getPlanesSalud(null, {
      tipoDocumento: 'RUN',
      documento: '26058878-8'
    })*/
  }

  clearForm(){
    this.documento = null;
    this.rutConfirmado = false;
    this.planesSalud = [];
    this.mainForm.reset()
  }

  confirmarRut(){
    const rutFormato = this.mainForm.value.username;
    if(!this.utils.validateRun(this.documento)){
      this.utils.mDialog("Error", "El RUT ingresado es incorrecto.", "message", false);
      return;
    }
    this.mainForm.patchValue({identificador: rutFormato})
    this.mainForm.controls.identificador.disable();
    this.rutConfirmado = true;
    this.triggedValidation(false);
    this.loading = true;
    this.getPlanesSalud(null, {
      tipoDocumento: 'RUN',
      documento: this.documento
    })
  }

  restoreFormatRut() {
    if (this.mainForm.value.username && this.mainForm.value.username.trim() != "") {
      let documento = this.mainForm.value.username.trim();
      documento = this.utils.replaceAll(documento, ".", "");
      documento = this.utils.replaceAll(documento, "-", "");
      this.mainForm.patchValue({username: documento});
    }
  }

  setFormatRut() {
    this.mainForm.patchValue({username: (this.mainForm.value.username) ? this.mainForm.value.username.trim() : null});
    let rut = this.mainForm.value.username;
    if (rut && rut != "") {
      let rutPuntos = this.utils.formatRut(rut);
      this.mainForm.patchValue({username: rutPuntos});
      this.documento = this.utils.replaceAll(rutPuntos, ".", "");
    }
  }

  triggedValidation(touched) {
    const obj = this.mainForm.value;
    Object.keys(obj).forEach(key => {
      touched ? this.mainForm.get(key).markAsTouched() : this.mainForm.get(key).markAsUntouched()
    });
  }

  get mf() {
    return this.mainForm.controls;
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
        }

        this.planesSalud = data;
        this.loading = false;
      }else{
        this.utils.mDialog("Error", "Se ha producido un error al cargar las previsiones", "message"), false;
      this.loading = false;
      }

    },()=>{
      this.utils.mDialog("Error", "Se ha producido un error al cargar las previsiones", "message", false);
      this.loading = false;
    })
  }

  guardar(){

    this.triggedValidation(true);
    if(this.mainForm.valid){
      let form = this.mainForm.getRawValue();
      this.correo = form.email;
      form.username = this.documento;
      form.identificador = this.documento;
      form.fono_movil = '+56' + form.fono_movil;
      form.fecha_nacimiento = form.fecha_nacimiento.toISOString().split("T")[0];
      if(!this.utils.validateEmail(form.email)){
        this.utils.mDialog("Error", "Formato de correo incorrecto.", "message");
        return;
      }
      this.loading = true;
      this.agendaService.guardarUsuario(form).then( (res:any) => {
        this.loading = false;
        if(res.statusCod === 'OK'){
            this.displayInputCode = true;
        }else{
          this.utils.mDialog("Estimado Usuario", "Los datos no pudieron ser guardados. Intente nuevamente.", "message", false);
        }
      }).catch( err =>{
        this.loading = false;
      })
    }
  }

  validarCodigo(){
    if(this.codeInput){
      const data = {
        username: this.documento,
        codigo: this.codeInput
      }
      this.agendaService.validarUsuario(data).then( (res:any) => {
        
        if(res.statusCod === 'OK'){
          this.utils.mDialog("Estimado Usuario", "Código validado correctamente. Ya puede ingresar con su RUT y clave.", "message");
        }else{
          this.utils.mDialog("Estimado Usuario", "La clave no pudo ser validada. Intente nuevamente...", "message", false);
        }

      });
    }else{
      this.utils.mDialog("Estimado Usuario", "Debe ingresar el código solicitado.", "message", false);

    }
  }

}
