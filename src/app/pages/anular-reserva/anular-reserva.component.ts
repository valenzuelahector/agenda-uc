import { Component, OnInit, ViewChild } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { MatDialog } from '@angular/material';
import { ConfirmarAnularReservaComponent } from 'src/app/shared/components/modals/confirmar-anular-reserva/confirmar-anular-reserva.component';
import { AgendaAmbulatoriaService } from 'src/app/services/agenda-ambulatoria.service';

@Component({
  selector: 'app-anular-reserva',
  templateUrl: './anular-reserva.component.html',
  styleUrls: ['./anular-reserva.component.scss']
})
export class AnularReservaComponent implements OnInit {

  @ViewChild('tabGroup', { static: true }) tabGroup:any;
  
  public respuestaAnular = {};
  public dataAnularCita:any = {};
  public curTab:number = 0;
  public todayTime = (new Date()).getTime();

  constructor(
    public utils:UtilsService,
    public dialog: MatDialog,
    public agendaService:AgendaAmbulatoriaService

  ) { }

  ngOnInit() {
    this.utils.showProgressBar();
    setTimeout(() => {
      this.utils.hideProgressBar();
    },2000)
  }

  avanzarEtapa(data, etapa){

    this.respuestaAnular = {};

    if(data['code'] && data['code'] === 'ERROR'){
      etapa = 'error'
    }

    switch(etapa){

      case 'buscarCita':
        this.dataAnularCita = { ...data }
        this.tabGroup.selectedIndex = 1;
        this.curTab = 1;


      break;

      case 'detalleCita':
        this.dataAnularCita['detalleCitaSeleccionada'] = data;
        this.tabGroup.selectedIndex = 2;
        this.curTab = 2;
      break;

      case 'error':

      this.respuestaAnular = {
          code: 'ERROR',
          message: data['message']
        }
        this.tabGroup.selectedIndex = 3;
        this.curTab = 3;

      break;
    }

  }

  volver(){

    if(this.curTab == 3){
      this.curTab = 0;
      this.dataAnularCita = {};
      this.respuestaAnular = {};
      this.utils.setEmitClearBusquedaAnular();
    }else{
      this.curTab--;
    }
    this.tabGroup.selectedIndex = this.curTab;

  }

  anularReserva(data){
    
    let dialogConfirm = this.dialog.open(ConfirmarAnularReservaComponent, {
      data:data,
      width: '640px',
      autoFocus: false
    });

    dialogConfirm.componentInstance.dialogEvent.subscribe( result => {
      
      if(result){

        const dataCita = {
          codCita: data['Numero'],
          codPaciente: this.dataAnularCita.dataBusqueda.documento,
          tipoIdPaciente:this.dataAnularCita.dataBusqueda.tipoDocumento,
          paisIdentificador:'CL',
          codEstado: 'ANULADA'
        }

        this.agendaService.cambiarEstadoCita(dataCita).subscribe( res => {

          if(res['statusCod'] == 'OK'){

            this.respuestaAnular = {
              code: 'OK',
              message: '¡La hora ha sido anulada con éxito!'
            }

            this.tabGroup.selectedIndex = 3;
            this.curTab = 3;

          }else{
            this.avanzarEtapa({ code: 'ERROR', message: res['statusDesc']}, 'error');
          }

        })
      }
    });

  }


  refrescarCitas(){
    this.utils.setReloadBusquedaAnular();
  }

}
