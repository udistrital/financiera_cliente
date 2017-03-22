'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:conceptos/conceptosPorRubrosOp
 * @description
 * # conceptos/conceptosPorRubrosOp
 */
angular.module('financieraClienteApp')
  .directive('conceptosPorRubrosOp', function (financieraRequest, $timeout) {
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
        self.gridOptions_conceptos = {
          enableRowSelection: false,
          enableRowHeaderSelection: false,
          enableCellEditOnFocus: true,
          columnDefs : [
            {field: 'Id',                         visible : false,            enableCellEdit: false},
            {field: 'Codigo',                     displayName: 'Codigo',      enableCellEdit: false},
            {field: 'Nombre',                     displayName: 'Nombre',      enableCellEdit: false},
            {field: 'Descripcion',                displayName: 'Descripcion', enableCellEdit: false},
            {field: 'TipoConcepto.Nombre',        displayName: 'Tipo',        enableCellEdit: false},
            {field: 'Rubro.Codigo',               displayName: 'Rubro',       enableCellEdit: false},
            {
              field: 'Afectacion',
              enableCellEdit: true,
              type: 'number',
              cellTemplate: '<div ng-init="row.entity.Afectacion=0">{{row.entity.Afectacion}}</div>',
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
        }
        //operar concepto
        self.operar_conceptos = function(){
          $scope.conceptos = [];
          var nun_conceptos = 0;
          // Controla que el retorno de los conceptos sean los que se le asigno afectacion
          angular.forEach(self.gridOptions_conceptos.data, function(i){
            if(i.Afectacion !=0 && i.Afectacion != undefined ){
              ++nun_conceptos;
              $scope.conceptos.push(i);
            }
          })
          // control que se afecte por lo menos un concepto
          if(nun_conceptos == 0){
            alert("debe afectar minimo un concepto")
          }else{
            // validar que la suma de las afectaciones en los conceptos pertenecientes a cada rubro no sobrepase el valor del rubro
            $scope.suma_afectacion = {};
            angular.forEach($scope.conceptos, function(concepto){
              if ($scope.suma_afectacion[concepto.Rubro.Id] == undefined){
                $scope.suma_afectacion[concepto.Rubro.Id] = concepto.Afectacion
              }else{
                $scope.suma_afectacion[concepto.Rubro.Id] = $scope.suma_afectacion[concepto.Rubro.Id] + concepto.Afectacion
              }
            });
            console.log("aaa");
            console.log($scope.suma_afectacion);
            console.log($scope.rubroidsobj);
            console.log("aaa");
            angular.forEach($scope.suma_afectacion, function(value, key){
              console.log(key + ': ' + value);
              console.log("--");
              angular.forEach($scope.rubroidsobj, function(rubro){
                console.log(rubro.DisponibilidadApropiacion.Apropiacion.Rubro.Id);
                console.log(rubro.Saldo)
                if(rubro.DisponibilidadApropiacion.Apropiacion.Rubro.Id == key){
                  console.log("afectacion: " + value)
                  console.log("saldo: " + rubro.Saldo)
                  if(value > rubro.Saldo){
                    console.log("ERRORR la afectacion supera el valor del saldo");
                  }
                }
                console.log("****");
              })
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
