// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true
};


export const ENV = {
  /*
  baseApi: 'https://apigw.ucchristus.cl',
  servRoute: '/agendaambulatoria-test',
  profRoute: '/profesionales-test',
  idPlanSaludInit: '4c30555e-5ed3-418f-8f54-a91a00ace99b',
  idCentrosNoDisponibles: [],
  idCentroPrioritario: '8ca284cf-482a-4248-bc8f-a92800f90207',
  mensajeSinCupos : '<h5>No se encontraron cupos disponibles.</h5>'
  */
 
  
 baseApi: 'https://apigw.ucchristus.cl',
 servRoute: '/agendaambulatoria-pre',
 profRoute: '/profesionales-pre',
 idPlanSaludInit: '0b7a577d-6364-4b28-b2ba-a96e00e243ac',
 idCentrosNoDisponibles: [],
 idCentroPrioritario: '52e43c90-8ab7-4e34-afcb-a96f0106bbd1',
 mensajeSinCupos : '<h5>Sin disponibilidad en agendamiento web. En caso de requerir atención presencial para vacunación por campaña influenza ministerial, ésta será por orden de llegada.</h5>'
}

/*
export const ENV2 = {
  baseApi: 'https://apigw.ucchristus.cl',
  servRoute: '/agendaambulatoria-prod',
  profRoute: '/profesionales-prod',
  idPlanSaludInit: '0b7a577d-6364-4b28-b2ba-a96e00e243ac',
  idCentrosNoDisponibles: [],
  idCentroPrioritario: '52e43c90-8ab7-4e34-afcb-a96f0106bbd1',
  mensajeSinCupos: '<h5>No se encontraron cupos disponibles.</h5>'
}*/

export const dummyData = {
  profesionalAsignado: {
    proximaHoraEpoch: 1590865927,
    compensacion: 240,
    area: {
      id: "aafc27df-882e-413b-bdcd-a96e00ddbc15",
      nombre: "Consultas"
    },
    profesional: {
      idProfesional: "a5dc511a-fbce-40a7-9999-a9a7012e3f5c",
      nombreProfesional: "PAUL ANDREW MCNAB MARTIN",
      esProfesional: true,
      informacionAdicional: "",
      soloAutoPagador: null,
      urlImagenProfesional: "https://proxy.prod.ucchristus.procloudhub.com/ThirdPartyService/Physicians(a5dc511a-fbce-40a7-9999-a9a7012e3f5c)/GetPicture",
      detalle: "PAUL ANDREW MCNAB MARTIN"
    },
    especialidad: {
      idServicio: "e5a95aa9-9def-49b7-8e76-a98a00f1d150",
      nombreServicio: "Consulta Médica",
      idEspecialidad: "ef03106b-3cfa-4f47-9344-a97400d3c2ae",
      nombreEspecialidad: "CARDIOLOGÍA ADULTOS",
      detalle: "CARDIOLOGÍA ADULTOS - Consulta Médica"
    },
    centroAtencion: {
      idCentro: "52e43c90-8ab7-4e34-afcb-a96f0106bbd1",
      nombre: "Clínica San Carlos de Apoquindo",
      idRegion: "6bad9b25-d5df-4565-b5fe-a6f701444053",
      direccion: {
        calle: "Camino El Alba",
        numero: "12407",
        piso: null,
        comuna: "Las Condes"
      },
      horaApertura: "08:00",
      horaCierre: "20:00",
      latitud: -33.400391,
      longitud: -70.5118382,
      detalle: "Clínica San Carlos de Apoquindo"
    }
  },
  profesionalesSimilares: [
    {
      proximaHoraEpoch: 1590865927,
      compensacion: 240,
      area: {
        id: "aafc27df-882e-413b-bdcd-a96e00ddbc15",
        nombre: "Consultas"
      },
      profesional: {
        idProfesional: "a5dc511a-fbce-40a7-9999-a9a7012e3f5c",
        nombreProfesional: "PAUL ANDREW MCNAB MARTIN",
        esProfesional: true,
        informacionAdicional: "",
        soloAutoPagador: null,
        urlImagenProfesional: "https://proxy.prod.ucchristus.procloudhub.com/ThirdPartyService/Physicians(a5dc511a-fbce-40a7-9999-a9a7012e3f5c)/GetPicture",
        detalle: "PAUL ANDREW MCNAB MARTIN"
      },
      especialidad: {
        idServicio: "e5a95aa9-9def-49b7-8e76-a98a00f1d150",
        nombreServicio: "Consulta Médica",
        idEspecialidad: "ef03106b-3cfa-4f47-9344-a97400d3c2ae",
        nombreEspecialidad: "CARDIOLOGÍA ADULTOS",
        detalle: "CARDIOLOGÍA ADULTOS - Consulta Médica"
      },
      centroAtencion: {
        idCentro: "52e43c90-8ab7-4e34-afcb-a96f0106bbd1",
        nombre: "Clínica San Carlos de Apoquindo",
        idRegion: "6bad9b25-d5df-4565-b5fe-a6f701444053",
        direccion: {
          calle: "Camino El Alba",
          numero: "12407",
          piso: null,
          comuna: "Las Condes"
        },
        horaApertura: "08:00",
        horaCierre: "20:00",
        latitud: -33.400391,
        longitud: -70.5118382,
        detalle: "Clínica San Carlos de Apoquindo"
      }
    },
    {
      proximaHoraEpoch: 1590865927,
      compensacion: 240,
      area: {
        id: "aafc27df-882e-413b-bdcd-a96e00ddbc15",
        nombre: "Consultas"
      },
      profesional: {
        idProfesional: "a5dc511a-fbce-40a7-9999-a9a7012e3f5c",
        nombreProfesional: "PAUL ANDREW MCNAB MARTIN",
        esProfesional: true,
        informacionAdicional: "",
        soloAutoPagador: null,
        urlImagenProfesional: "https://proxy.prod.ucchristus.procloudhub.com/ThirdPartyService/Physicians(a5dc511a-fbce-40a7-9999-a9a7012e3f5c)/GetPicture",
        detalle: "PAUL ANDREW MCNAB MARTIN"
      },
      especialidad: {
        idServicio: "e5a95aa9-9def-49b7-8e76-a98a00f1d150",
        nombreServicio: "Consulta Médica",
        idEspecialidad: "ef03106b-3cfa-4f47-9344-a97400d3c2ae",
        nombreEspecialidad: "CARDIOLOGÍA ADULTOS",
        detalle: "CARDIOLOGÍA ADULTOS - Consulta Médica"
      },
      centroAtencion: {
        idCentro: "52e43c90-8ab7-4e34-afcb-a96f0106bbd1",
        nombre: "Clínica San Carlos de Apoquindo",
        idRegion: "6bad9b25-d5df-4565-b5fe-a6f701444053",
        direccion: {
          calle: "Camino El Alba",
          numero: "12407",
          piso: null,
          comuna: "Las Condes"
        },
        horaApertura: "08:00",
        horaCierre: "20:00",
        latitud: -33.400391,
        longitud: -70.5118382,
        detalle: "Clínica San Carlos de Apoquindo"
      }
    },
    {
      proximaHoraEpoch: 1590865927,
      compensacion: 240,
      area: {
        id: "aafc27df-882e-413b-bdcd-a96e00ddbc15",
        nombre: "Consultas"
      },
      profesional: {
        idProfesional: "a5dc511a-fbce-40a7-9999-a9a7012e3f5c",
        nombreProfesional: "PAUL ANDREW MCNAB MARTIN",
        esProfesional: true,
        informacionAdicional: "",
        soloAutoPagador: null,
        urlImagenProfesional: "https://proxy.prod.ucchristus.procloudhub.com/ThirdPartyService/Physicians(a5dc511a-fbce-40a7-9999-a9a7012e3f5c)/GetPicture",
        detalle: "PAUL ANDREW MCNAB MARTIN"
      },
      especialidad: {
        idServicio: "e5a95aa9-9def-49b7-8e76-a98a00f1d150",
        nombreServicio: "Consulta Médica",
        idEspecialidad: "ef03106b-3cfa-4f47-9344-a97400d3c2ae",
        nombreEspecialidad: "CARDIOLOGÍA ADULTOS",
        detalle: "CARDIOLOGÍA ADULTOS - Consulta Médica"
      },
      centroAtencion: {
        idCentro: "52e43c90-8ab7-4e34-afcb-a96f0106bbd1",
        nombre: "Clínica San Carlos de Apoquindo",
        idRegion: "6bad9b25-d5df-4565-b5fe-a6f701444053",
        direccion: {
          calle: "Camino El Alba",
          numero: "12407",
          piso: null,
          comuna: "Las Condes"
        },
        horaApertura: "08:00",
        horaCierre: "20:00",
        latitud: -33.400391,
        longitud: -70.5118382,
        detalle: "Clínica San Carlos de Apoquindo"
      }
    },
    {
      proximaHoraEpoch: 1590865927,
      compensacion: 240,
      area: {
        id: "aafc27df-882e-413b-bdcd-a96e00ddbc15",
        nombre: "Consultas"
      },
      profesional: {
        idProfesional: "a5dc511a-fbce-40a7-9999-a9a7012e3f5c",
        nombreProfesional: "PAUL ANDREW MCNAB MARTIN",
        esProfesional: true,
        informacionAdicional: "",
        soloAutoPagador: null,
        urlImagenProfesional: "https://proxy.prod.ucchristus.procloudhub.com/ThirdPartyService/Physicians(a5dc511a-fbce-40a7-9999-a9a7012e3f5c)/GetPicture",
        detalle: "PAUL ANDREW MCNAB MARTIN"
      },
      especialidad: {
        idServicio: "e5a95aa9-9def-49b7-8e76-a98a00f1d150",
        nombreServicio: "Consulta Médica",
        idEspecialidad: "ef03106b-3cfa-4f47-9344-a97400d3c2ae",
        nombreEspecialidad: "CARDIOLOGÍA ADULTOS",
        detalle: "CARDIOLOGÍA ADULTOS - Consulta Médica"
      },
      centroAtencion: {
        idCentro: "52e43c90-8ab7-4e34-afcb-a96f0106bbd1",
        nombre: "Clínica San Carlos de Apoquindo",
        idRegion: "6bad9b25-d5df-4565-b5fe-a6f701444053",
        direccion: {
          calle: "Camino El Alba",
          numero: "12407",
          piso: null,
          comuna: "Las Condes"
        },
        horaApertura: "08:00",
        horaCierre: "20:00",
        latitud: -33.400391,
        longitud: -70.5118382,
        detalle: "Clínica San Carlos de Apoquindo"
      }
    },
    {
      proximaHoraEpoch: 1590865927,
      compensacion: 240,
      area: {
        id: "aafc27df-882e-413b-bdcd-a96e00ddbc15",
        nombre: "Consultas"
      },
      profesional: {
        idProfesional: "a5dc511a-fbce-40a7-9999-a9a7012e3f5c",
        nombreProfesional: "PAUL ANDREW MCNAB MARTIN",
        esProfesional: true,
        informacionAdicional: "",
        soloAutoPagador: null,
        urlImagenProfesional: "https://proxy.prod.ucchristus.procloudhub.com/ThirdPartyService/Physicians(a5dc511a-fbce-40a7-9999-a9a7012e3f5c)/GetPicture",
        detalle: "PAUL ANDREW MCNAB MARTIN"
      },
      especialidad: {
        idServicio: "e5a95aa9-9def-49b7-8e76-a98a00f1d150",
        nombreServicio: "Consulta Médica",
        idEspecialidad: "ef03106b-3cfa-4f47-9344-a97400d3c2ae",
        nombreEspecialidad: "CARDIOLOGÍA ADULTOS",
        detalle: "CARDIOLOGÍA ADULTOS - Consulta Médica"
      },
      centroAtencion: {
        idCentro: "52e43c90-8ab7-4e34-afcb-a96f0106bbd1",
        nombre: "Clínica San Carlos de Apoquindo",
        idRegion: "6bad9b25-d5df-4565-b5fe-a6f701444053",
        direccion: {
          calle: "Camino El Alba",
          numero: "12407",
          piso: null,
          comuna: "Las Condes"
        },
        horaApertura: "08:00",
        horaCierre: "20:00",
        latitud: -33.400391,
        longitud: -70.5118382,
        detalle: "Clínica San Carlos de Apoquindo"
      }
    },
    {
      proximaHoraEpoch: 1590865927,
      compensacion: 240,
      area: {
        id: "aafc27df-882e-413b-bdcd-a96e00ddbc15",
        nombre: "Consultas"
      },
      profesional: {
        idProfesional: "a5dc511a-fbce-40a7-9999-a9a7012e3f5c",
        nombreProfesional: "PAUL ANDREW MCNAB MARTIN",
        esProfesional: true,
        informacionAdicional: "",
        soloAutoPagador: null,
        urlImagenProfesional: "https://proxy.prod.ucchristus.procloudhub.com/ThirdPartyService/Physicians(a5dc511a-fbce-40a7-9999-a9a7012e3f5c)/GetPicture",
        detalle: "PAUL ANDREW MCNAB MARTIN"
      },
      especialidad: {
        idServicio: "e5a95aa9-9def-49b7-8e76-a98a00f1d150",
        nombreServicio: "Consulta Médica",
        idEspecialidad: "ef03106b-3cfa-4f47-9344-a97400d3c2ae",
        nombreEspecialidad: "CARDIOLOGÍA ADULTOS",
        detalle: "CARDIOLOGÍA ADULTOS - Consulta Médica"
      },
      centroAtencion: {
        idCentro: "52e43c90-8ab7-4e34-afcb-a96f0106bbd1",
        nombre: "Clínica San Carlos de Apoquindo",
        idRegion: "6bad9b25-d5df-4565-b5fe-a6f701444053",
        direccion: {
          calle: "Camino El Alba",
          numero: "12407",
          piso: null,
          comuna: "Las Condes"
        },
        horaApertura: "08:00",
        horaCierre: "20:00",
        latitud: -33.400391,
        longitud: -70.5118382,
        detalle: "Clínica San Carlos de Apoquindo"
      }
    }
  ]
}
