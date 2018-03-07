'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:PacCierrePeriodoCtrl
 * @description
 * # PacCierrePeriodoCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('ConsultaComprobantesCtrl', function ($scope, $translate,financieraMidRequest,financieraRequest) {
  	var ctrl = this;
    $scope.botones = [
      { clase_color: "editar", clase_css: "fa fa-pencil fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.EDITAR'), operacion: 'edit', estado: true },
      { clase_color: "borrar", clase_css: "fa fa-times-circle fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.CONSULTAR'), operacion: 'inactive', estado: true }
    ];

    ctrl.Comprobantes = {
        enableFiltering: true,
        enableSorting: true,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        paginationPageSizes: [25, 50, 75],
        paginationPageSize: 10,
        useExternalPagination: true,
        columnDefs: [
            { field: 'Id', visible: false },
            { field: 'Ano',displayName: $translate.instant('ANO'), cellClass: 'input_center', headerCellClass: 'text-info' },
            { field: 'Mes',displayName: $translate.instant('MES'), cellClass: 'input_center', headerCellClass: 'text-info' },
            { field: 'FechaRegistro',displayName: $translate.instant('FECHA_REGISTRO'), cellClass: 'input_center', headerCellClass: 'text-info' },
            { field: 'TipoComprobante.Nombre',displayName: $translate.instant('TIPO_COMPROBANTE'), cellClass: 'input_center', headerCellClass: 'text-info' },
            { field: 'TipoComprobante.Descripcion',displayName: $translate.instant('DESCRIPCION'), cellClass: 'input_center', headerCellClass: 'text-info' },
            { field: 'EstadoComprobante.Nombre',displayName: $translate.instant('ESTADO'), cellClass: 'input_center', headerCellClass: 'text-info' },
            {
                field: 'Opciones',
                cellTemplate: '<center>' +
                    ' <a type="button" class="editar" ng-click="grid.appScope.cdpConsulta.verDisponibilidad(row,false)" > ' +
                    '<i class="fa fa-eye fa-lg  faa-shake animated-hover" aria-hidden="true" data-toggle="tooltip" title="{{\'BTN.VER\' | translate }}"></i></a>' +
                    ' <a type="button" class="borrar" aria-hidden="true" ng-click="grid.appScope.cdpConsulta.verDisponibilidad(row,true)" >' +
                    '<i class="fa fa-file-excel-o fa-lg  faa-shake animated-hover" aria-hidden="true" data-toggle="tooltip" title="{{\'BTN.ANULAR\' | translate }}"></i></a>',
                headerCellClass: 'text-info',
                enableFiltering: false
            }
        ]

    };

    financieraRequest.get("orden_pago/FechaActual/2006", '') //formato de entrada  https://golang.org/src/time/format.go
        .then(function(response) { //error con el success
            self.vigenciaActual = parseInt(response.data);
            var dif = self.vigenciaActual - 1995;
            var range = [];
            range.push(self.vigenciaActual);
            for (var i = 1; i < dif; i++) {
                range.push(self.vigenciaActual - i);
            }
            self.years = range;
            console.log("años")
            console.log(self.years)
            self.Vigencia = self.vigenciaActual;


        });

        $scope.loadrow = function(row, operacion) {
            self.operacion = operacion;

              switch (operacion) {
                  case "edit":
                      //funcion
                      break;
                case "borrar":
                      //funcion
                      break;
                  default:
              }


        };

    });
