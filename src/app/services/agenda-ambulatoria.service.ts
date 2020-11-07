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

  getEspecialidadesByGeneric(idArea:any, filtro:any = null, idServicio:string = null){
    let keyf = (filtro) ? '&filtro=' + filtro : '';
    let ids = (idServicio) ? '&idServicio=' + idServicio : '';

    return this.http.get(this.baseApi + '/Servicios/Rel/Especialidades?idArea=' + idArea + keyf + ids);
  }

  getEspecialidadesByProfesional(idProfesional: string, idArea:string, filtro:any = null){
    let keyf = (filtro) ? '&filtro=' + filtro : '';
    return this.http.get(this.baseApi + '/Servicios/Rel/Especialidades?idProfesional=' + idProfesional + '&idArea=' + idArea + keyf);
  }

  getProfesionales(idArea:string, filtro:any = null, idProfesional:string = null){
    let keyf = (filtro) ? '&patronNombre=' + filtro : '';
    let idp = (idProfesional) ? '&idProfesional=' + idProfesional : '';

    return this.http.get(this.baseApi + '/Profesionales?idArea=' + idArea + keyf + idp);
  }

  getProfesionalesByQuery(query:string){
    return this.http.get(this.baseApi + '/Profesionales?' + query);
  }

  getCentrosByEspecialidad(idServicio:string, idArea:string, idProfesional = null){
    let queryProfesional = (idProfesional) ? '&idProfesional=' + idProfesional : '';
    return this.http.get(this.baseApi + '/Centros?idServicio=' + idServicio + '&idArea=' + idArea + queryProfesional);
  }

  getRecursos(queryData:any){

    let queryProfesional = (queryData.idProfesional) ? '&profesional=' + queryData.idProfesional : '';
    let queryCentro = (queryData.todosCentro) ? '&idRegion=' + queryData.idCentro : '&idCentro=' + queryData.idCentro;
    let endpoint = (queryData.idProfesional) ? 'CuposProfFechas' : 'CuposEspecCentro';
    let fromProfRel = (queryData.fromProfRel) ? '&fromProfRel=true' : '';

    return this.http.get(this.baseApi +
      '/Agenda/'+endpoint+'?tipoResponse=2&fechaInicio=' + queryData.fechaInicio +'&fechaTermino=' + queryData.fechaTermino +
      '&idServicio=' + queryData.idServicio + '&codCanal=PatientPortal&idPlanSalud=' + queryData.idPlanSalud + queryProfesional  + queryCentro + fromProfRel
  );
  }

  getPaciente(idn:string, tipoIdPaciente:string){
    return this.http.get(this.baseApi + '/Pacientes?idPaciente='+idn+'&tipoIdPaciente='+tipoIdPaciente+'&paisIdentificador=CL');
  }

  postPaciente(data:any){
    return this.http.post(this.baseApi + '/Pacientes', data, this.httpOptions);
  }

  putPaciente(data:any){
    return this.http.put(this.baseApi + '/Pacientes', data, this.httpOptions);
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

  getMensajes(data, type = null){

    let qrProf = "";
    if(data.ResourceId && data.ResourceId != ""){
      qrProf = '&idProfesional=' + data.ResourceId;
    }

    return this.http.get(this.baseApi + '/Mensajes?idCentro=' + data.CenterId + '&codCanal=PatientPortal&idServicio=' + data.ServiceId + qrProf);
  }

  buscarCita(data){
    return this.http.get(this.baseApi + '/Citas/Lista?idPaciente='+data.idPaciente+'&tipoIdPaciente='+data.tipoIdPaciente+'&paisIdentificador=CL&fechaCita='+data.fechaCita);
  }

  cambiarEstadoCita(data){
    return this.http.put(this.baseApi + '/Citas', data, this.httpOptions);
  }

  postListaDeEspera(data){
    return this.http.post(this.baseApi + '/ListaDeEspera/Pacientes', data).toPromise();
  }

  getCuposInmediatos(){
    return this.http.get(this.baseApi + '/Agenda/CuposInmediatos?idArea=' + ENV.areaConsultaMedica.id ).toPromise();
  }

  postProcedimiento(data){
    return this.http.post(this.baseApi + '/SolicitudProcedimiento', data).toPromise();
  }

  getReglasExclusion(codContexto, data){
    
    const idServicio = '&idServicio=' + data.idServicio;
    const idCentro = data.idCentro ? '&idCentro=' + data.idCentro : '';
    const idProfesional = data.idProfesional ? '&idProfesional=' + data.idProfesional : ''

    return this.http.get(this.baseApi + '/ReglasExclusion/Validar?codContexto=' + codContexto + idCentro + idServicio + idProfesional ).toPromise();
  }
}
