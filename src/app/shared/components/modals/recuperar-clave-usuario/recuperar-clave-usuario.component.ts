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
        this.utils.mDialog("Estimado Usuario", res.usrMsg, "message");
      }else{
        this.utils.mDialog("Estimado Usuario", res.usrMsg, "message", false);
      }
    }).catch( err =>{
      this.loading = false;
    });

  }

}
