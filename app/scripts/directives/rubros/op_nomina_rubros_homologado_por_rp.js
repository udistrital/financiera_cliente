'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:rubros/opNominaRubrosHomologadoPorRp
 * @description
 * # rubros/opNominaRubrosHomologadoPorRp
 */
angular.module('financieraClienteApp')
  .directive('opNominaRubrosHomologadoPorRp', function (financieraMidRequest, financieraRequest, $timeout, $translate) {
    return {
      restrict: 'E',
      scope:{
        inputpestanaabierta: '=?',
        inputprocesoexternoid: '=?',
        inputregistropresupuestal: '=?',
        outputconceptos: '=?'
        },

      templateUrl: 'views/directives/rubros/op_nomina_rubros_homologado_por_rp.html',
      controller:function($scope){
        var self = this;
        self.refresh = function() {
          $scope.refresh = true;
          $timeout(function() {
            $scope.refresh = false;
          }, 0);
        };
        self.gridOptions_rubros = {
          expandableRowTemplate: 'expandableRowUpc.html',
          expandableRowHeight: 100,
          enableRowHeaderSelection: false,
          multiSelect: false,
          columnDefs: [{
              field: 'RegistroPresupuestalDisponibilidadApropiacion.DisponibilidadApropiacion.Apropiacion.Rubro.Id',
              visible: false
            },
            {
              field: 'RegistroPresupuestalDisponibilidadApropiacion.DisponibilidadApropiacion.Apropiacion.Rubro.Codigo',
              displayName: $translate.instant('CODIGO') + ' ' + $translate.instant('RUBRO'),
              cellClass: 'input_center'
            },
            {
              field: 'RegistroPresupuestalDisponibilidadApropiacion.DisponibilidadApropiacion.Apropiacion.Rubro.Vigencia',
              displayName: $translate.instant('VIGENCIA'),
              width: '5%',
              cellClass: 'input_center'
            },
            {
              field: 'RegistroPresupuestalDisponibilidadApropiacion.DisponibilidadApropiacion.Apropiacion.Rubro.Descripcion',
              displayName: $translate.instant('DESCRIPCION')
            },
            {
              field: 'RegistroPresupuestalDisponibilidadApropiacion.Valor',
              displayName: $translate.instant('VALOR'),
              cellFilter: 'currency',
              width: '14%',
              cellClass: 'input_right'
            },
            {
              field: 'RegistroPresupuestalDisponibilidadApropiacion.Saldo',
              displayName: $translate.instant('SALDO'),
              cellFilter: 'currency',
              width: '14%',
              cellClass: 'input_right'
            }, //obtenido por servicio financieraRequest.post('registro_presupuestal/SaldoRp',rpData)
            {
              field: 'RegistroPresupuestalDisponibilidadApropiacion.DisponibilidadApropiacion.FuenteFinanciamiento.Descripcion',
              displayName: $translate.instant('FUENTES_FINANCIACION')
            },
            {
              field: 'RegistroPresupuestalDisponibilidadApropiacion.DisponibilidadApropiacion.FuenteFinanciamiento.Codigo',
              displayName: $translate.instant('FUENTE_FINANCIACION_CODIGO'),
              width: '7%',
              cellClass: 'input_center'
            },
          ]
        };
        //
        $scope.$watch('inputpestanaabierta', function() {
          if ($scope.inputpestanaabierta) {
            $scope.a = true;
          }
        })
        //
        $scope.$watch('inputprocesoexternoid', function() {
          self.refresh();
          if ($scope.inputprocesoexternoid) {
            console.log("homologar");
            self.dataHomologacion = {};
            self.dataHomologacion.IdLiquidacion = $scope.inputprocesoexternoid;
            self.dataHomologacion.RegistroPresupuestal = $scope.inputregistropresupuestal;

            financieraMidRequest.post('homologacion/MidHomologacionLiquidacion', self.dataHomologacion)
            .then(function(response) {
              $scope.Homologacion = response.data;
              console.log($scope.Homologacion.Body);
              console.log("homologar");
              //
              if ($scope.Homologacion.Type == "success" ){
                console.log("trabajar");
                self.gridOptions_rubros.data = $scope.Homologacion.Body;

                angular.forEach(self.gridOptions_rubros.data, function(iterador){
                  var rpData = {
                    Rp: iterador.RegistroPresupuestalDisponibilidadApropiacion.RegistroPresupuestal,
                    Apropiacion: iterador.RegistroPresupuestalDisponibilidadApropiacion.DisponibilidadApropiacion.Apropiacion,
                    FuenteFinanciacion: iterador.RegistroPresupuestalDisponibilidadApropiacion.DisponibilidadApropiacion.FuenteFinanciamiento
                  };
                  financieraRequest.post('registro_presupuestal/SaldoRp', rpData
                  ).then(function(response) {
                    iterador.RegistroPresupuestalDisponibilidadApropiacion.Saldo = response.data.saldo;
                  });
                  //subgrid
                  //iterador.subGridOptions.data = [];
                  //iterador.subGridOptions.data.push(iterador.ConceptoValor);

                  iterador.subGridOptions = {
                    enableRowHeaderSelection: false,
                    multiSelect: false,
                    columnDefs: [{
                        field: 'Concepto.Id',
                        visible: true,
                        enableCellEdit: false
                      },
                      {
                        field: 'Concepto.Codigo',
                        displayName: $translate.instant('CODIGO') + ' ' + $translate.instant('CONCEPTO'),
                        enableCellEdit: false,
                        width: '15%',
                        cellClass: 'input_center'
                      },
                      {
                        field: 'Concepto.Nombre',
                        displayName: $translate.instant('NOMBRE'),
                        enableCellEdit: false
                      },
                      {
                        field: 'Concepto.Descripcion',
                        displayName: $translate.instant('DESCRIPCION'),
                        enableCellEdit: false
                      },
                      {
                        field: 'Concepto.TipoConcepto.Nombre',
                        displayName: $translate.instant('TIPO'),
                        enableCellEdit: false,
                        width: '10%',
                      },
                      {
                        field: 'Valor',
                        displayName: $translate.instant('AFECTACION'),
                        cellFilter: 'currency',
                        width: '14%',
                        cellClass: 'input_right'
                      },
                    ]
                  }; //subGridOptions



                }) //iterador
              }else{
                console.log("reportar homologacion fallida");
              }
              //
            })
          }else{
            self.gridOptions_rubros.data = {};
          }
        })
      //
      self.AsignarAfectacionHomologado = function(conceptoId, arrayConceptoValor){

      }
      //
      },
      controllerAs:'d_opNominaRubrosHomologadoPorRp'
    };
  });
