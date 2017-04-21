'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:conceptos/conceptosPorRubrosOp
 * @description
 * # conceptos/conceptosPorRubrosOp
 */
angular.module('financieraClienteApp')
  .directive('conceptosPorRubrosOp', function (financieraRequest, $timeout, $translate) {
    return {
      restrict: 'E',
      scope:{
        rubroids:'=?',
        conceptos:'=?',
        rubroidsobj:'=?', //objeto rubro que contine el saldo
        },

      templateUrl: 'views/directives/conceptos/conceptos_por_rubros_op.html',
      controller:function($scope){
        var self = this;
        self.conceptos = [];
        $scope.suma_afectacion = {};
        self.mensajes_alerta_conceptos = null;
        self.gridOptions_conceptos = {
          enableRowSelection: false,
          enableRowHeaderSelection: false,
          enableCellEditOnFocus: true,
          columnDefs : [
            {field: 'Id',                         visible : false,                                enableCellEdit: false},
            {field: 'Codigo',                     displayName: $translate.instant('CODIGO'),      enableCellEdit: false},
            {field: 'Nombre',                     displayName: $translate.instant('NOMBRE'),      enableCellEdit: false},
            {field: 'Descripcion',                displayName: $translate.instant('DESCRIPCION'), enableCellEdit: false},
            {field: 'TipoConcepto.Nombre',        displayName: $translate.instant('TIPO'),        enableCellEdit: false},
            {field: 'Rubro.Codigo',               displayName: $translate.instant('RUBRO'),       enableCellEdit: false},
            {
              field: 'Afectacion',
              displayName: $translate.instant('AFECTACION'),
              enableCellEdit: true,
              type: 'number',
              cellFilter: 'currency',
              //cellTemplate: '<div ng-init="row.entity.Afectacion=0">{{row.entity.Afectacion}}</div>',
              editableCellTemplate: '<div><form><input type="number" min="0" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD"></form></div>'
            }
          ]
        };
        self.gridOptions_conceptos.multiSelect = false;
        // refrescar
        self.refresh = function() {
          $scope.refresh = true;
          $timeout(function() {
            $scope.refresh = false;
          }, 0);
        };
        //
        self.consulta = function(ids){
          self.conceptos = [];
          angular.forEach(ids, function(i){
            financieraRequest.get('concepto',
            $.param({
              query: "Rubro.Id:" + i,
              limit:0
            })
            ).then(function(response) {
              if(response.data){
                angular.forEach(response.data, function(datas){
                    self.conceptos.push(datas);
                });
              }
            });
          });
          self.gridOptions_conceptos.data = self.conceptos;
          $scope.gridHeight = self.gridOptions_conceptos.rowHeight * 4 + (self.gridOptions_conceptos.data.length * self.gridOptions_conceptos.rowHeight);
        }
        //operar concepto
        self.operar_conceptos = function(){
          $scope.conceptos = [];
          self.mensajes_alerta_conceptos = '';
          var nun_conceptos = 0;
          // Controla que el retorno de los conceptos sean los que se le asigno afectacion
          angular.forEach(self.gridOptions_conceptos.data, function(i){
            if(i.Afectacion > 0 && i.Afectacion != undefined ){
              ++nun_conceptos;
              $scope.conceptos.push(i);
            }
          })
          // control que se afecte por lo menos un concepto
          if(nun_conceptos == 0){
            swal("Error!", "Debe Afectar por lo menos un concepto ", "error")
          }else{
            $scope.suma_afectacion = {};
            // construir objeto rubro id con su total de afectacion
            angular.forEach($scope.conceptos, function(concepto){
              if ($scope.suma_afectacion[concepto.Rubro.Id] == undefined){
                $scope.suma_afectacion[concepto.Rubro.Id] = concepto.Afectacion
              }else{
                $scope.suma_afectacion[concepto.Rubro.Id] = $scope.suma_afectacion[concepto.Rubro.Id] + concepto.Afectacion
              }
            });
            // validar que la suma de las afectaciones en los conceptos pertenecientes a cada rubro no sobrepase el valor del rubro
            angular.forEach($scope.suma_afectacion, function(value, key){
              angular.forEach($scope.rubroidsobj, function(rubro){
                if(rubro.DisponibilidadApropiacion.Apropiacion.Rubro.Id == key && value > rubro.Saldo){
                  self.mensajes_alerta_conceptos = self.mensajes_alerta_conceptos + "<li> El Total de la afectación a los Conceptos pertenecientes al Rubro: " +  rubro.DisponibilidadApropiacion.Apropiacion.Rubro.Codigo + "  supera el valor del saldo. <br> <b>Afectación:" + value + "<br>Saldo:" + rubro.Saldo + "</b></li>"
                }
              })
            })
          }
          // valida si hay errores y lanzamos la alerta
          if(self.mensajes_alerta_conceptos.length != 0 ){
            $scope.conceptos = null;
            swal({
              title: 'Error!',
              html:  '<ol align="left">' + self.mensajes_alerta_conceptos + '</ol>',
              type: 'error'
            })
          }
        }
        // fin operar concepto
        $scope.$watch('rubroids', function(){
          self.refresh();
          self.consulta($scope.rubroids);
        })
        // fin
      },
      controllerAs:'d_conceptosPorRubrosOp'
    };
  });
