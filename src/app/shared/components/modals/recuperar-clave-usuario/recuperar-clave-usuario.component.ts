import { Component, OnInit } from '@angular/core';
import { AgendaAmbulatoriaService } from 'src/app/services/agenda-ambulatoria.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-recuperar-clave-usuario',
  templateUrl: './recuperar-clave-usuario.component.html',
  styleUrls: ['./recuperar-clave-usuario.component.scss']
})
export class RecuperarClaveUsuarioComponent implements OnInit {

  documento = "";
  documentoFormatted = "";
  loading = false;
  displayChangePass = false;
  claveActual;
  claveNueva;
  confirmarClaveNueva;

  constructor(
    public utils: UtilsService,
    public agendaService: AgendaAmbulatoriaService
  ) { }

  ngOnInit() {
  }

  restoreFormatRut() {
    if (this.documentoFormatted && this.documentoFormatted.trim() != "") {
      let documento = this.documentoFormatted.trim();
      documento = this.utils.replaceAll(documento, ".", "");
      documento = this.utils.replaceAll(documento, "-", "");
      this.documentoFormatted = documento;
    }
  }

  setFormatRut() { 
    let rut = this.documentoFormatted;
    if (rut && rut != "") {
      let rutPuntos = this.utils.formatRut(rut);
      this.documentoFormatted = rutPuntos;
      this.documento = this.utils.replaceAll(rutPuntos, ".", "");
    }
  }

  recuperar(){

    if(!this.utils.validateRun(this.documento)){
      this.utils.mDialog("Error", "El rut ingresado es incorrecto.", "message", false);
      return;
    }
    this.loading = true;
    this.agendaService.recuperarClave(this.documento).then( (res:any) => {
      this.loading = false;
      if(res.statusCod === 'OK'){
        this.displayChangePass = true;
      }else{
        this.utils.mDialog("Estimado Usuario", "Hubo un error al solicitar la clave", "message", false);
      }
    }).catch( err =>{
      this.loading = false;
    });

  }

  cambiarClave(){
    if(!this.claveActual){
      this.utils.mDialog('Error', 'El código de 6 dígitos es obligatorio.', 'message', false);
      return;
    }

    if(!this.claveNueva){
      this.utils.mDialog('Error', 'La nueva contraseña es obligatoria.', 'message', false);
      return;
    }

    if(!this.confirmarClaveNueva){
      this.utils.mDialog('Error', 'Debes confirmar la nueva contraseña.', 'message', false);
      return;
    }

    if(this.claveNueva !== this.confirmarClaveNueva){
      this.utils.mDialog('Error', 'Las contraseñas no coinciden.', 'message', false);
      return;
    }

    const data = {
      username: this.documento,
      new_password: this.claveNueva,
      confirmation_code: this.claveActual
    }

    this.agendaService.cambiarClave(data).then((res:any) => {
      if(res.statusCod === 'OK'){
        this.utils.mDialog('Error', 'La contraseña ha sido cambiada correctamente.', 'message');
      }else{
        this.utils.mDialog("Estimado Usuario", "La clave no pudo ser cambiada. Intente nuevamente...", "message", false);
      }
    });

  }
}
