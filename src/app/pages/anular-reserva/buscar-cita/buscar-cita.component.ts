import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-buscar-cita',
  templateUrl: './buscar-cita.component.html',
  styleUrls: ['./buscar-cita.component.scss', './../anular-reserva.component.scss']
})
export class BuscarCitaComponent implements OnInit {

  @ViewChild("formDirective", { static: false }) formDirective: FormGroupDirective;
  
  public today = new Date();
  public busquedaPaciente: any = {
    tipoDocumento: "RUN",
    documento: null,
    documentoFormateado: null,
    fechaReserva: null
  }

  constructor(
    public utils: UtilsService,
  ) { }

  ngOnInit() {

  }

  setFormatRut() {
    this.busquedaPaciente.documentoFormateado = (this.busquedaPaciente.documentoFormateado) ?
      this.busquedaPaciente.documentoFormateado.trim() : null;

    if (this.busquedaPaciente.tipoDocumento == 'RUN'){
      let rut = this.busquedaPaciente.documentoFormateado;
      if (rut && rut != "") {
        let rutPuntos = this.utils.formatRut(rut)
        this.busquedaPaciente.documentoFormateado = rutPuntos
        this.busquedaPaciente.documento = this.utils.replaceAll(rutPuntos, ".", "");
      }
    }else{
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
