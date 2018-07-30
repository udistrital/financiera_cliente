'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:verSolicitud
 * @description
 * # verSolicitud
 */
angular.module('financieraClienteApp')
  .directive('verSolicitud', function() {
    return {
      restrict: 'E',
      scope: {
        sol: '=?',
        tipos: '=?'
      },
      templateUrl: 'views/directives/avance/ver_solicitud.html',

      controller: function($scope,$translate,administrativaPruebasRequest) {
        var ctrl = this;

        $scope.botones = [
          { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true },
        ];

        ctrl.cargando = true;
        ctrl.hayData = true;
        ctrl.infoPresupuestal={};

        ctrl.gridInfPresupuesto = {
          enableFiltering: false,
          enableSorting: false,
          enableRowSelection: false,
          enableRowHeaderSelection: false,
          enableHorizontalScrollbar: 0,
          enableVerticalScrollbar: 0,
          columnDefs: [
              {
                  field: 'necesidad.numero',
                  displayName: $translate.instant('NECESIDAD_NO'),
                  width: '50%',
                  headerCellClass: 'encabezado',
              },
              {
                  name: $translate.instant('NO_CDP'),
                  width: '50%',
                  headerCellClass: 'encabezado',
                  cellTemplate: '<div class="ngCellText" ><a href="" ng-click="grid.appScope.verDisponibilidad(row)">row.entity.disponibilidad.NumeroDisponibilidad</a></div>'

              },
          ]
        };

        $scope.$watch('sol', function() {
          ctrl.solicitud = $scope.sol;
          ctrl.tipo_avance = $scope.tipos;
        });

        ctrl.cargar_info_presupuestal= function(){
          administrativaPruebasRequest.get("necesidad_proceso_externo",
                  $.param({
                      query: "proceso_externo:" + $scope.sol.Id + ",TipoNecesidad.NumeroOrden:3",
                      limit: -1
                  })).then(function(response){
                    if(response.data.Necesidad!=null){
                      ctrl.infoPresupuestal.necesidad = response.data.Necesidad;
                      financieraMidRequest.get("disponibilidad/DisponibilidadByNecesidad/"+response.data.Necesidad.Id,'').then(function(response){
                        ctrl.infoPresupuestal.disponibilidad = reponse.data.DisponibilidadApropiacion.Disponibilidad;
                        ctrl.gridInfPresupuesto.data = ctrl.infoPresupuestal;
                      });
                    }
                  });
        }
        ctrl.cargar_info_presupuestal();
        ctrl.verDisponibilidad = function(row){
          var numero = row.entity.disponibilidad.NumeroDisponibilidad;
          var vigencia = row.entity.disponibilidad.Vigencia;
          console.log('Numero: ', numero);
          console.log('Vigencia: ', vigencia);
          $window.open('#/cdp/cdp_consulta?vigencia='+vigencia+'&numero='+numero, '_blank', 'location=yes');
        };
      },
      controllerAs: 'd_verSolicitud'
    };
  });
