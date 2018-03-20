'use strict';

/**
 * @ngdoc service
 * @name ingresoDocServ
 * @description
 * # ingresoDoc
 * Service in the financieraClienteApp.
 */
angular.module('ingresoDocServ',[])
  .service('ingresoDoc', function () {
    var savedData = {}
 function set(data) {
   savedData = data;
 }
 function get() {
  return savedData;
 }

 return {
  set: set,
  get: get
 }

  });
