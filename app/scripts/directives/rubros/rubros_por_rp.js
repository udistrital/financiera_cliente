'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:rubros/rubrosPorRp
 * @description
 * # rubros/rubrosPorRp
 */
angular.module('financieraClienteApp')
  .directive('rubrosPorRp', function (financieraRequest) {
    return {
      restrict: 'E',
      scope:{
          rpid:'=?',
          rubroseleccionado:'=?'
        },
      templateUrl: '/views/directives/rubros/rubros_por_rp.html',
      controller:function($scope){
        var ctrl = this;
        // cambios en rpid
        $scope.$watch('rpid', function(){
          // get rubros de un rp especifico
          financieraRequest.get("registro_presupuestal_disponibilidad_apropiacion",
            $.param({
              query:"RegistroPresupuestal.Id:" + $scope.rpid,
              limit:0,
            })
          ).then(function(response){
            $scope.gridRubrosPorRp.data  = response.data
          });
        });
        // grid rubros por rp
        $scope.gridRubrosPorRp = {
          enableFiltering: true,
          onRegisterApi: function(gridApi){
            $scope.gridApi = gridApi;
          }
        };
        $scope.gridRubrosPorRp.columnDefs = [
          {
            name: 'DisponibilidadApropiacion.Apropiacion.Rubro.Id',
            displayName: "Id",
          },
          {
            name: 'DisponibilidadApropiacion.Apropiacion.Rubro.Codigo',
            displayName: "Codigo",
          },
          {
            name: 'DisponibilidadApropiacion.Apropiacion.Rubro.Descripcion',
            displayName: "Descripcion",
          },
          {
            name: 'DisponibilidadApropiacion.Apropiacion.Rubro.Vigencia',
            displayName: "Vigencia",
          },
          {
            //<button class="btn primary" ng-click="grid.appScope.deleteRow(row)">Delete</button>
            name: 'Operacion',
             enableFiltering: false,
            cellTemplate:
            '<center>\
              <button ng-click="grid.appScope.seleccionar_rubro(row)" type="button" class="btn btn-success btn-circle"><i class="glyphicon glyphicon-eye-open""></i></button>\
            </center>'
          }
        ];
        //
        $scope.seleccionar_rubro = function(rubro){
          $scope.rubroseleccionado = rubro.entity.DisponibilidadApropiacion.Apropiacion.Rubro;
        }

      },
      controllerAs:'d_rubrosPorRp'
    };
  });
