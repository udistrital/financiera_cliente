'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:PacCierrePeriodoCtrl
 * @description
 * # PacCierrePeriodoCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
    .factory("comprobante", function() {
        return {};
    })
  .controller('ConsultaComprobantesCtrl', function (comprobante,$localStorage,$scope, $translate,financieraMidRequest,financieraRequest,$location,$route) {
  	var ctrl = this;
    $scope.botones = [
      { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true },

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
            { field: 'Secuencia', visible: false },
            { field: 'Ano',displayName: $translate.instant('ANO'), cellClass: 'input_center', headerCellClass: 'text-info' },
            { field: 'Mes',displayName: $translate.instant('MES'), cellClass: 'input_center', headerCellClass: 'text-info',  cellFilter: 'filtro_nombres_meses:row.entity'},
            { field: 'FechaRegistro',displayName: $translate.instant('FECHA_REGISTRO'),cellClass: 'input_center', cellTemplate: '<span>{{row.entity.FechaRegistro| date:"yyyy-MM-dd":"+0900"}}</span>', headerCellClass: 'text-info' },
            { field: 'TipoComprobante.CodigoAbreviacion',displayName: $translate.instant('TIPO_COMPROBANTE'), cellClass: 'input_center', headerCellClass: 'text-info' },
            { field: 'TipoComprobante.Nombre',visible:false},
            { field: 'TipoComprobante.Descripcion',displayName: $translate.instant('DESCRIPCION'), cellClass: 'input_center', headerCellClass: 'text-info' },
            { field: 'EstadoComprobante.Nombre',displayName: $translate.instant('ESTADO'), cellClass: 'input_center', headerCellClass: 'text-info' },
            {
                field: 'Opciones',
                displayName: $translate.instant('OPCIONES'),
                cellTemplate: '<center><btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro><center>',
                headerCellClass: 'text-info'
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
                case "ver":
                    ctrl.ver_detalle_comprobante(row);

                    break;
              default:
            }
        };

        financieraRequest.get('comprobante','').then(function(response) {
          ctrl.Comprobantes.data = response.data;
        });

        ctrl.crearComprobante = function(){
          $location.path('/comprobantes/crear_comprobante');
          $route.reload()
        };

        ctrl.ver_detalle_comprobante = function (row){

          ctrl.comprobante = comprobante;
          ctrl.comprobante.Id = row.entity.Id;
          ctrl.comprobante.Ano = row.entity.Ano;
          ctrl.comprobante.Mes = row.entity.Mes;
          ctrl.comprobante.FechaRegistro = row.entity.FechaRegistro;
          ctrl.comprobante.CodigoAbreviacion = row.entity.TipoComprobante.CodigoAbreviacion;
          ctrl.comprobante.Nombre = row.entity.TipoComprobante.Nombre;
          ctrl.comprobante.Secuencia = row.entity.Secuencia;
          $localStorage.comprobante = ctrl.comprobante;

          $location.path('/comprobantes/detalle_comprobante');
          $route.reload()
        }

    }).filter('filtro_nombres_meses', function($filter, $translate) {
        return function(input, entity) {
            var output;
            if (undefined === input || null === input) {
                return "";
            }

            if (entity.Mes === 1) {
                output = $translate.instant('ENERO');
            }
            if (entity.Mes === 2) {
                output = $translate.instant('FEBRERO');
            }
            if (entity.Mes === 3) {
                output = $translate.instant('MARZO');
            }
            if (entity.Mes === 4) {
                output = $translate.instant('ABRIL');
            }
            if (entity.Mes === 5) {
                output = $translate.instant('MAYO');
            }
            if (entity.Mes === 6) {
                output = $translate.instant('JUNIO');
            }
            if (entity.Mes === 7) {
                output = $translate.instant('JULIO');
            }
            if (entity.Mes === 8) {
                output = $translate.instant('AGOSTO');
            }
            if (entity.Mes === 9) {
                output = $translate.instant('SEPTIEMBRE');
            }
            if (entity.Mes === 10) {
                output = $translate.instant('OCTUBRE');
            }
            if (entity.Mes === 11) {
                output = $translate.instant('NOVIEMBRE');
            }
            if (entity.Mes === 12) {
                output = $translate.instant('DICIEMBRE');
            }
            return output;
        };
    });
