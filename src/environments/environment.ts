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
  idCentrosNoDisponibles: ['8ca284cf-482a-4248-bc8f-a92800f90207']
  /*servRoute: '/agendaambulatoria-prod',
  profRoute: '/profesionales-prod',
  idPlanSaludInit: '0b7a577d-6364-4b28-b2ba-a96e00e243ac',
  idCentrosNoDisponibles: ['52e43c90-8ab7-4e34-afcb-a96f0106bbd1']*/
}
