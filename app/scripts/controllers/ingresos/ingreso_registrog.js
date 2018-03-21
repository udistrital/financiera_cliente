'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:IngresosIngresoRegistrogCtrl
 * @description
 * # IngresosIngresoRegistrogCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('IngresosIngresoRegistrogCtrl', function ($scope,$translate,$routeParams,administrativaRequest,financieraRequest,coreRequest,ingresoDoc) {
    var ctrl = this;

    $scope.valorDescIng = $routeParams.tipoIngreso;

    ctrl.registrar= false;
    ctrl.concepto = [];
    ctrl.fechaDocumento = new Date();

    ctrl.FormaIngreso = ingresoDoc.get();

    ctrl.filtro_ingresos = "Ingreso";

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
                    $scope.ingresoRegistroG.concepto[0].Rubro = response.data[0].Rubro;
                });
            }
        }, true);

        ctrl.registrarIngreso = function() {
          ctrl.registrar= true;
                ctrl.ingreso = {
                    Ingreso: {
                        FormaIngreso:ctrl.FormaIngreso,
                        FechaInicio: ctrl.fechaInicio,
                        FechaFin: ctrl.fechaFin,
                        Observaciones: ctrl.observaciones,
                        UnidadEjecutora: ctrl.unidadejecutora,
                        aportante: Number(ctrl.aportanteSelec.Id), 
                        NumCuenta: ctrl.numeroCuenta.toString()
                    },
                    DocumentoGenerador:{
                        NumDocumento:ctrl.numDoc,
                        FechaDocumento:ctrl.fechaDocumento,
                        TipoDocumento:ctrl.documentoSelec.Id
                    },
                    IngresoBanco: ctrl.total,
                    Concepto: ctrl.concepto[0]
                };
                angular.forEach(ctrl.movs, function(data) {
                    delete data.Id;
                });
                ctrl.ingreso.Movimientos = ctrl.movs;
                console.log(ctrl.ingreso);
                financieraRequest.post('ingreso/CreateIngresos', ctrl.ingreso).then(function(response) {
                    if (response.data.Type !== undefined) {
                        if (response.data.Type === "error") {
                            swal('', $translate.instant(response.data.Code), response.data.Type);
                        } else {
                            var templateAlert = "<table class='table table-bordered'><th>" + $translate.instant('NO') + "</th><th>" + $translate.instant('VIGENCIA') + "</th>";

                            templateAlert = templateAlert + "<tr class='success'><td>" + response.data.Body.Consecutivo + "</td>" + "<td>" + response.data.Body.Vigencia + "</td>" ;

                            swal('', templateAlert, response.data.Type);
                        }
                    }
                }).finally(function() {
                    ctrl.pagos = undefined;
                    ctrl.tipoIngresoSelec = undefined;
                    ctrl.observaciones = undefined;
                    ctrl.unidadejecutora = undefined;
                    ctrl.concepto = undefined;
                    ctrl.registrar= false;
                });
        };


  });
