'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:PacCierrePeriodoCtrl
 * @description
 * # PacCierrePeriodoCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('CrearComprobanteCtrl', function ($location,$window,$scope, $translate,financieraMidRequest,financieraRequest) {
  	var ctrl = this;


    ctrl.TipoComprobantes = {
        enableFiltering: true,
        enableSorting: true,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        paginationPageSizes: [5, 10, 20],
        paginationPageSize: 10,

        columnDefs: [
            { field: 'Id', visible: false },
            { field: 'CodigoAbreviacion',displayName: $translate.instant('CODIGO'), cellClass: 'input_center', headerCellClass: 'text-info' },
            { field: 'Nombre',displayName: $translate.instant('NOMBRE'), cellClass: 'input_center', headerCellClass: 'text-info' },
            { field: 'Descripcion',displayName: $translate.instant('DESCRIPCION'), cellClass: 'input_center', headerCellClass: 'text-info' },
            { field: 'UnidadEjecutora',visible:false},
            { field: 'UnidadEjecutoraNombre',displayName: $translate.instant('UNIDAD_EJECUTORA'), cellClass: 'input_center', headerCellClass: 'text-info' },
            { field: 'Entidad', visible:false },
            { field: 'EntidadNombre',displayName: $translate.instant('ENTIDAD'), cellClass: 'input_center', headerCellClass: 'text-info' },
            ]
    };

    ctrl.TipoComprobantes.onRegisterApi = function(gridApi) {
        ctrl.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            $scope.tipo_comprobante_seleccionado = row.entity

        });
    };

    ctrl.TipoComprobantes.multiSelect = false;

    financieraRequest.get('tipo_comprobante','').then(function(response) {


      angular.forEach(response.data, function(data){
        financieraRequest.get('unidad_ejecutora','limit=-1&query=Id:'+data.UnidadEjecutora).then(function(response) {
          data.UnidadEjecutoraNombre = response.data[0].Nombre
        });
      });

      angular.forEach(response.data, function(data){
        financieraRequest.get('entidad','limit=-1&query=Id:'+data.Entidad).then(function(response) {
          data.EntidadNombre = response.data[0].Nombre
        });
      });

        ctrl.TipoComprobantes.data = response.data;

    });

    ctrl.crearComprobante = function (){

      if(ctrl.redondeo === "true" ){
        ctrl.valor_red = Boolean("true")
      }else{
        ctrl.valor_red = Boolean(false)
      }

      var tipo_comprobante = {
        Id: $scope.tipo_comprobante_seleccionado.Id
      }

      var estado_comprobante = {
        Id: 1
      }


      var nuevo_comprobante = {
        Secuencia: 1,
        //Secuencia: parseInt(ctrl.Secuencia),
        NumeroItems: parseInt(ctrl.NumeroItems),
        Redondeo: ctrl.valor_red,
        TipoComprobante: tipo_comprobante,
        EstadoComprobante: estado_comprobante
      }

      financieraRequest.post('comprobante', nuevo_comprobante).then(function(response) {
            if (typeof(response.data) == "object") {
              swal({
                  html: $translate.instant('ALERTA_CREACION_COM_CORRECTA'),
                  type: "success",
                  showCancelButton: false,
                  confirmButtonColor: "#449D44",
                  confirmButtonText: $translate.instant('VOLVER'),
              }).then(function() {

                $location.path('/comprobantes/consulta_comprobantes');
                $route.reload()
              })
          } else {
              swal({
                  html: $translate.instant('ALERTA_CREACION_COM_INCORRECTA'),
                  type: "error",
                  showCancelButton: false,
                  confirmButtonColor: "#449D44",
                  confirmButtonText: $translate.instant('VOLVER'),
              }).then(function() {
                  $window.location.reload()
              })
          }
      });




    };

    });
