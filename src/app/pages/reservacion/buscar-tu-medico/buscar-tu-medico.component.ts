import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { Validators, FormControl } from '@angular/forms';
import { dummyData } from 'src/environments/environment';

@Component({
  selector: 'app-buscar-tu-medico',
  templateUrl: './buscar-tu-medico.component.html',
  styleUrls: ['./buscar-tu-medico.component.scss']
})
export class BuscarTuMedicoComponent implements OnInit {

  documento = null;
  documentoFC = new FormControl('');
  @Output() datosBeneficiarioMedico: EventEmitter<any> = new EventEmitter();

  constructor(public utils:UtilsService) { }

  ngOnInit() {
  }

  eventEnter(event){
    if (event.keyCode == 13) {
      this.buscarRut();
    }
  }

  restoreFormatRut() {
    if (this.documentoFC.value && this.documentoFC.value.trim() != "" ) {
      let documento = this.documentoFC.value.trim();
      documento = this.utils.replaceAll(documento, ".", "");
      documento = this.utils.replaceAll(documento, "-", "");
      this.documentoFC.setValue(documento);
    }
  }

  setFormatRut() {
    this.documentoFC.setValue((this.documentoFC.value) ? this.documentoFC.value.trim() : null);
    let rut = this.documentoFC.value;
    if (rut && rut != "") {
      let rutPuntos = this.utils.formatRut(rut);
      this.documentoFC.setValue(rutPuntos);
      this.documento = this.utils.replaceAll(rutPuntos, ".", "");
    }
  }

  buscarRut(){

    let rut = this.documento;
    let esBeneficiario = true;

    this.documentoFC.markAsTouched();
    this.documentoFC.setErrors({});
    if(!rut){
      this.documentoFC.setErrors({ required: true});
      return false;
    }
    
    if(!this.utils.validateRun(this.documento)){
      this.documentoFC.setErrors({ invalidRut: true});
      return false;
    }

    //Acá va el método de consulta si existe el beneficiario
    if(!esBeneficiario){
      this.documentoFC.setErrors({ notFoundRut: true});
      return false; 
    }else{
      const data = dummyData
      this.utils.showProgressBar();
      this.datosBeneficiarioMedico.emit({rut, data});
    }
  }

}
