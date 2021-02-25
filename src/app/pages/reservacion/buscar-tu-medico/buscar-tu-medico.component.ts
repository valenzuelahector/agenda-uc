import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { Validators, FormControl } from '@angular/forms';
import { ENV } from 'src/environments/environment';
import { AgendaAmbulatoriaService } from 'src/app/services/agenda-ambulatoria.service';

@Component({
  selector: 'app-buscar-tu-medico',
  templateUrl: './buscar-tu-medico.component.html',
  styleUrls: ['./buscar-tu-medico.component.scss']
})
export class BuscarTuMedicoComponent implements OnInit {

  documento = null;
  documentoFC = new FormControl('');
  @Output() datosBeneficiarioMedico: EventEmitter<any> = new EventEmitter();

  constructor(
    public utils: UtilsService,
    public agendaService: AgendaAmbulatoriaService) { }

  ngOnInit() {
  }

  eventEnter(event) {
    if (event.keyCode == 13) {
      this.buscarRut();
    }
  }

  restoreFormatRut() {
    if (this.documentoFC.value && this.documentoFC.value.trim() != "") {
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

  buscarRut() {

    let rut = this.documento;

    this.documentoFC.markAsTouched();

    if (!rut) {
      this.documentoFC.setErrors({ required: true });
      return false;
    }

    if (!this.utils.validateRun(this.documento)) {
      this.documentoFC.setErrors({ invalidRut: true });
      return false;
    }

    this.utils.showProgressBar();

    this.agendaService.validarEnrolamiento(rut.split('-').join('')).then(async (res: any) => {

      const esBeneficiario = (res.estado && res.estado.toUpperCase() === 'OK');

      if (!esBeneficiario) {

        this.documentoFC.setErrors({ notFoundRut: true });

      } else {

        this.documentoFC.markAsUntouched();
        this.documentoFC.setErrors({});

        try {

          const rutmed = res.rut_medico;
          const rutMedTr = `${rutmed.substring(0, rutmed.length - 1)}-${rutmed.charAt(rutmed.length - 1)}`;
          this.agendaService.getDatosProfesional(null, rutMedTr).subscribe(async (prof: any) => {
            this.setBusquedaCalendario(prof.datosProfesional).then( busqueda => {
              this.datosBeneficiarioMedico.emit(busqueda);
              this.utils.hideProgressBar();
              this.documento = null;
              this.documentoFC.setValue('');
            }).catch(err => {
              this.utils.mDialog('Error', 'No se ha podido finalizar la consulta. Intente más tarde.', 'message');
              this.utils.hideProgressBar();    
            });
          });

        } catch (err) {

          this.utils.mDialog('Error', 'No se ha podido finalizar la consulta. Intente más tarde.', 'message');
          this.utils.hideProgressBar();

        }

      }

    });

  }

  async setBusquedaCalendario(prof) {

    return new Promise((resolve, reject) => {


      this.agendaService.getEspecialidadesByProfesional(prof.idProfesionalPRM, ENV.areaConsultaMedica.id).subscribe((srvRequest: any) => {

        try {

          let servicio = null;

          if (srvRequest && srvRequest.especialidadesPorServicio && srvRequest.especialidadesPorServicio.length > 0) {

            servicio = srvRequest.especialidadesPorServicio.find( item => {
              return item.idEspecialidad === ENV.saludIntegral.idEspecialidad
            });

            if (!servicio) {
              reject(false);
              return false;
            }

          } else {

            reject(false);
            return false;

          }

          const profesional = {
            idProfesional: prof.idProfesionalPRM,
            nombreProfesional: `${prof.nombres} ${prof.apellidoPaterno} ${prof.apellidoMaterno}`,
            esProfesional: true,
            informacionAdicional: "",
            soloAutoPagador: null,
            urlImagenProfesional: `${prof.urlFoto}`,
            detalle: `${prof.nombres} ${prof.apellidoPaterno} ${prof.apellidoMaterno}`
          };

          const centroAtencion = {
            direccion: {
              calle: null,
              numero: null,
              piso: null,
              comuna: "Región Metropolitana"
            },
            horaApertura: null,
            horaCierre: null,
            idCentro: ENV.idRegion,
            idRegion: ENV.idRegion,
            latitud: null,
            longitud: null,
            nombre: "Todos",
            codigo: "todos",
            detalle: "Todos - Región Metropolitana"
          };

          const centrosDisponibles = [];
          const area = ENV.areaConsultaMedica;
          const documentoPaciente = {
            tipoDocumento: "RUN",
            documento: this.documento,
            documentoFormateado: this.utils.formatRut(this.documento)
          };

          const especialidad = servicio;

          const datosImagenes = {
            aplicaMedioContraste: false,
            archivo: null,
            requierePresupuesto: false,
            idEncuesta: null
          };

          const busqueda = {
            area,
            profesional,
            especialidad,
            centroAtencion,
            documentoPaciente,
            centrosDisponibles,
            datosImagenes
          };

          resolve(busqueda);


        } catch (err) {

          reject(false);

        }

      });

    });


  }

}
