// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true
};


export const ENV = {
  baseApi: 'https://apigw.ucchristus.cl',
  servRoute: '/agendaambulatoria-test',
  profRoute: '/profesionales-test',
  idPlanSaludInit: '4c30555e-5ed3-418f-8f54-a91a00ace99b',
  idCentrosNoDisponibles: [],
  idCentroPrioritario: '8ca284cf-482a-4248-bc8f-a92800f90207',
  mensajeSinCupos : '<h5>No se encontraron cupos disponibles en el mes seleccionado, intente buscar en el siguiente mes.</h5>'
}
/*
export const ENV = {
  baseApi: 'https://apigw.ucchristus.cl',
  servRoute: '/agendaambulatoria-test',
  profRoute: '/profesionales-test',
  idPlanSaludInit: '4c30555e-5ed3-418f-8f54-a91a00ace99b',
  idCentrosNoDisponibles: [],
  idCentroPrioritario: '8ca284cf-482a-4248-bc8f-a92800f90207',
  mensajeSinCupos : '<h5>Sin disponibilidad en agendamiento web. En caso de requerir atención presencial para vacunación por campaña influenza ministerial, ésta será por orden de llegada.</h5>'
}*/