'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:InversionesConsultaTitulosCtrl
 * @description
 * # InversionesConsultaTitulosCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('InversionesConsultaTitulosCtrl', function ($scope,$translate,financieraRequest) {
    var ctrl = this;
    ctrl.gridOptions = {
      paginationPageSizes: [5, 15, 20],
      paginationPageSize: 5,
      enableFiltering: true,
      enableSorting: true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
        columnDefs: [{
            field: 'Id',
            visible: false
        }, {
            field: 'Nombre',
            displayName: $translate.instant('NOMBRE'),
            headerCellClass: 'text-info',
            enableFiltering: true
        }, {
            field: 'Descripcion',
            displayName: $translate.instant('DESCRIPCION'),
            headerCellClass: 'text-info'
        }, {
            field: 'CodigoAbreviacion',
            displayName: $translate.instant("CODIGO_ABREVIACION"),
            headerCellClass: 'text-info',
            enableFiltering: true
        }],
        onRegisterApi: function(gridApi) {
            ctrl.gridApi = gridApi;
        }
    };
    ctrl.getTitulos = function(){
    financieraRequest.get("titulo_inversion", $.param({
        limit: -1
      })).then(function(response) {
        ctrl.gridOptions.data = response.data;
      });
    };

    ctrl.getTitulos();

    ctrl.limpiar = function(){
      ctrl.TituloInversion = {};
    };
    ctrl.registrar = function(){
      financieraRequest.post('titulo_inversion', ctrl.TituloInversion).then(function(response){

        if(response.data.Type != undefined){
          if(response.data.Type === "error"){
              swal('',$translate.instant(response.data.Code),response.data.Type);
            }else{
              swal('',$translate.instant(response.data.Code),response.data.Type).then(function(){
                $("#modalRegistroPr").modal('hide');
                ctrl.getTitulos();
              });
            }
          }
      });
    };
  });
