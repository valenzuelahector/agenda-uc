import { Injectable } from '@angular/core';
import { ENV } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AgendaAmbulatoriaService {

  public servRoute:string = ENV.servRoute;
  public profRoute:string = ENV.profRoute;
  public baseApi:string;
  public httpOptions: any;

  constructor(public http:HttpClient) {
    this.baseApi = ENV.baseApi + this.servRoute;
    this.httpOptions = {
      headers: new HttpHeaders({
        'X-AppTimezone' : "-180",
        'Content-Type'  : "application/json; odata.metadata=minimal"
      })
    };
  }

  getAreas(){
    return this.http.get(this.baseApi + '/Areas');
  }

  getEspecialidadesByGeneric(idArea:any){
    return this.http.get(this.baseApi + '/Servicios/Rel/Especialidades?idArea=' + idArea);
  }

  getEspecialidadesByProfesional(idProfesional: string, idArea:string){
    return this.http.get(this.baseApi + '/Servicios/Rel/Especialidades?idProfesional=' + idProfesional + '&idArea=' + idArea);
  }

  getProfesionales(idArea:string){
    return this.http.get(this.baseApi + '/Profesionales?idArea=' + idArea);
  }

  getCentrosByEspecialidad(idServicio:string, idArea:string, idProfesional = null){
    let queryProfesional = (idProfesional) ? '&idProfesional=' + idProfesional : '';
    return this.http.get(this.baseApi + '/Centros?idServicio=' + idServicio + '&idArea=' + idArea + queryProfesional);
  }

  getRecursos(queryData:any){

    let queryProfesional = (queryData.idProfesional) ? '&profesional=' + queryData.idProfesional : '';
    let queryCentro = (queryData.todosCentro) ? '&idRegion=' + queryData.idCentro : '&idCentro=' + queryData.idCentro;
    let endpoint = (queryData.idProfesional) ? 'CuposProfFechas' : 'CuposEspecCentro';

    return this.http.get(this.baseApi +
      '/Agenda/'+endpoint+'?fechaInicio=' + queryData.fechaInicio +'&fechaTermino=' + queryData.fechaTermino +
      '&idServicio=' + queryData.idServicio + '&codCanal=PatientPortal&idPlanSalud=' + queryData.idPlanSalud + queryProfesional  + queryCentro
  );
  }

  getPaciente(idn:string, tipoIdPaciente:string){
    return this.http.get(this.baseApi + '/Pacientes?idPaciente='+idn+'&tipoIdPaciente='+tipoIdPaciente+'&paisIdentificador=CL');
  }

  postPaciente(data:any){
    return this.http.post(this.baseApi + '/Pacientes', data, this.httpOptions);
  }

  postCita(data:any){
    return this.http.post(this.baseApi + '/Citas', data, this.httpOptions);
  }

  getPlanesSalud(idPaciente, data = null){
    let queryString = (idPaciente) ? 
                      'idPaciente=' + idPaciente : 
                      'tipoIdPaciente=' + data['tipoDocumento'] + '&idPaciente=' + data['documento'] + '&paisIdentificador=CL'
    
                      return this.http.get(this.baseApi + '/PlanesDeSalud?' + queryString);
  }

  getDatosProfesional(idProfesional:any){
    return this.http.get(ENV.baseApi + this.profRoute + '/Perfil?idProfesional=' + idProfesional + "&tipoIdProfesional=PRM");
  }

  geReglasValidacion(query:any){
    return this.http.get(this.baseApi + '/Agenda/CuposDisponibilidad?idCentro=' + query.idCentro + '&fechaInicio=' + query.fechaInicio + '&fechaTermino=' + query.fechaTermino + '&idServicio=' + query.idServicio + '&idPlanSalud=' + query.idPlanSalud + '&idPaciente='+query.idPaciente+'&idDisponibilidad='+query.idDisponibilidad+'&idProfesional='+query.idProfesional+'&codCanal=PatientPortal')
  }

  getMensajes(data){
    return this.http.get(this.baseApi + '/Mensajes?idProfesional=' + data.ResourceId + '&idCentro=' + data.CenterId + '&idServicio=' + data.ServiceId + '&codCanal=PatientPortal')
  }

}
