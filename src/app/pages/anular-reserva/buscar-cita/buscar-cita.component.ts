import { Component, OnInit, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { UtilsService } from 'src/app/services/utils.service';
import { AgendaAmbulatoriaService } from 'src/app/services/agenda-ambulatoria.service';

@Component({
  selector: 'app-buscar-cita',
  templateUrl: './buscar-cita.component.html',
  styleUrls: ['./buscar-cita.component.scss', './../anular-reserva.component.scss']
})
export class BuscarCitaComponent implements OnInit, OnDestroy {

  @ViewChild("formDirective", { static: false }) formDirective: FormGroupDirective;
  
  @Output() public emitBusquedaCita:EventEmitter<any> = new EventEmitter();

  public clearBusqueda;
  public reloadBusqueda;
  public today = new Date();
  public busquedaPaciente: any = {
    tipoDocumento: "RUN",
    documento: null,
    documentoFormateado: null,
    fechaCita: null
  }

  constructor(
    public utils: UtilsService,
    public agendaService:AgendaAmbulatoriaService
  ) { }

  ngOnInit() {

    this.clearBusqueda = this.utils.getEmitClearBusquedaAnular().subscribe( res => {
      this.busquedaPaciente = {
        tipoDocumento: "RUN",
        documento: null,
        documentoFormateado: null,
        fechaCita: null
      }
    });

    this.reloadBusqueda = this.utils.getReloadBusquedaAnular().subscribe( res => {
      this.buscarCita();
    });
    
  }

  ngOnDestroy(){
    this.clearBusqueda.unsubscribe();
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

  buscarCita(){

    if(!this.busquedaPaciente.tipoDocumento){
      this.utils.mDialog("Error", "El tipo de documento del paciente es obligatorio", "message");
      return false;
    }

    if(!this.busquedaPaciente.documento){
      this.utils.mDialog("Error", "El número de documento del paciente es obligatorio", "message");
      return false;
    }

    if(!this.busquedaPaciente.fechaCita){
      this.utils.mDialog("Error", "La fecha de la reserva del paciente es obligatorio", "message");
      return false;
    }

    if(this.busquedaPaciente.tipoDocumento == 'RUN' && !this.utils.validateRun(this.busquedaPaciente.documento)){
      this.utils.mDialog("Error", "El formato del RUT es incorrecto. Verifique e intente nuevamente", "message");
      return false;
    }

    let formData = Object.assign({},this.busquedaPaciente);
    let serviceData = {
      idPaciente : formData['documento'],
      tipoIdPaciente : formData['tipoDocumento'],
      fechaCita : (formData['fechaCita'].toISOString()).split("T")[0]
    }

    this.agendaService.buscarCita(serviceData).subscribe( async data => {

      let response = [];
      let paciente = {};
      let busquedaCita;

      if(data && data['citas'] && data['citas'].length > 0){

        data['citas'].forEach( (val, key) => {
          data['citas'][key]['fechaTime'] = (new Date(val['FechaHoraDesde'])).getTime();
        })
        
        response = data['citas'];
        paciente = await this.getPaciente(formData['documento'], formData['tipoDocumento']);
        busquedaCita = {
          code:'OK',
          dataBusqueda: formData,
          citas: response,
          paciente: paciente
        }
      }else{

        busquedaCita = {
          code: 'ERROR', 
          message: data['statusDesc']
        }
        
      }
      
      this.emitBusquedaCita.emit(busquedaCita)
    })

  }

  getPaciente(documento, tipoDocumento){
    return new Promise((resolve, reject) => {
      this.agendaService.getPaciente(documento, tipoDocumento).subscribe( data => {
        if (data['listaPacientes'] && data['listaPacientes'][0]) {
          resolve(data['listaPacientes'][0]);
        }else{
          resolve({})
        }
      })
    })
  }
}
