'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:IngresosIngresoRegistrogCtrl
 * @description
 * # IngresosIngresoRegistrogCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('IngresosIngresoRegistrogCtrl', function ($scope,$translate,$routeParams,administrativaRequest,financieraRequest,coreRequest) {
    var ctrl = this;

    $scope.valorDescIng = $routeParams.tipoIngreso;
    ctrl.filtro_ingresos = "Ingreso";
    ctrl.concepto = [];

    ctrl.cargarAportantes = function(){

    administrativaRequest.get("informacion_persona_juridica", $.param({
       	fields: "Id,DigitoVerificacion,NomProveedor",
        limit: -1
      })).then(function(response) {
        ctrl.aportantes = response.data;
      });
  }

  ctrl.cargarUnidadesEjecutoras = function() {
            financieraRequest.get('unidad_ejecutora', $.param({
                limit: -1
            })).then(function(response) {
                ctrl.unidadesejecutoras = response.data;
            });
        };

ctrl.cargarTipoDocumento = function() {
        coreRequest.get('documento',
          $.param({
            query: "TipoDocumento.DominioTipoDocumento.CodigoAbreviacion:DD-FINA,Activo:True,TipoDocumento.CodigoAbreviacion:TD-ING",
            limit: -1
          })
        ).then(function(response) {
          ctrl.documentos = response.data;
        });
        };

  ctrl.cargarTipoDocumento();
  ctrl.cargarAportantes();
  ctrl.cargarUnidadesEjecutoras();

$scope.$watch('ingresoRegistroG.concepto[0]', function(oldValue, newValue) {
            if (!angular.isUndefined(newValue)) {
                financieraRequest.get('concepto', $.param({
                    query: "Id:" + newValue.Id,
                    fields: "Rubro",
                    limit: -1
                })).then(function(response) {
                    console.log(newValue);
                    console.log(response.data[0].Rubro);
                    $scope.ingresoRegistroG.concepto[0].Rubro = response.data[0].Rubro;
                });
            }
        }, true);



  });
