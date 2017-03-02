'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:rubros/rubrosPorRp
 * @description
 * # rubros/rubrosPorRp
 */
angular.module('financieraClienteApp')
  .directive('rubrosPorRp', function () {
    return {
      restrict: 'E',
      scope:{
          rubros:'=?'
        },
      templateUrl: '/views/directives/rubros/rubros_por_rp.html',
      controller:function($scope){
        var ctrl = this;

        $scope.$watch('rubros', function(){
          $scope.gridRubrosPorRp.data = $scope.rubros;
        })

        // grid rubros por rp
        $scope.gridRubrosPorRp = {
          enableFiltering: true,
          onRegisterApi: function(gridApi){
            $scope.gridApi = gridApi;
          }
        };
        $scope.gridRubrosPorRp.columnDefs = [
          {
            name: 'Id',
            displayName: "Id",
          },
          {
            name: 'Codigo',
            displayName: "Codigo",
          },
          {
            //<button class="btn primary" ng-click="grid.appScope.deleteRow(row)">Delete</button>
            name: 'Operacion',
             enableFiltering: false,
            cellTemplate:
            '<center>\
              <button ng-click="grid.appScope.cargar_ivas(row)" type="button" class="btn btn-success btn-circle"><i class="glyphicon glyphicon-eye-open""></i></button>\
              <button ng-click="grid.appScope.get_categoria(row)" type="button" class="btn btn-success btn-circle"><i class="glyphicon glyphicon-pencil""></i></button>\
            </center>'
          }
        ];
        //

      },
      controllerAs:'d_rubrosPorRp'
    };
  });
