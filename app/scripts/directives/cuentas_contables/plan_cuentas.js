'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:planCuentas
 * @restrict E
 * @scope
 * @requires financieraService.service:financieraRequest
 * @requires $scope
 * @param {object} seleccion cuenta seleccionada en el panel
 * @param {object|string|int} filtro dato para filtrar por cualquier atributo en la estructura
 * @param {object} cuentasel cuenta seleccionada en la estructura
 * @param {undefined} recargar dato de cualquier tipo que al cambiar recarga la estructura
 * @param {string|int} planid Id del plan de cuentas a cargarse
 * @description
 * # planCuentas
 * Directiva en la cual se muestra la estructura de cuentas de cualquier plan de cuentas que sea pasado por el scope de la misma
 */
angular.module('financieraClienteApp')
  .directive('planCuentas', function(financieraRequest) {
    return {
      restrict: 'E',
      //variables del scope de la directiva
      scope: {
        seleccion: '=?',
        filtro: '=?',
        cuentasel: '=?',
        recargar: '=?',
        planid: '=?',
        arbol: '=?',
        noresumen: '@?',
        ramasel: '=?',
        rdesc:"=?",
        btnselnom: '=?'
      },
      templateUrl: 'views/directives/cuentas_contables/plan_cuentas.html', //url del template de la directiva
      controller: function($scope, $attrs, $translate) {
        var self = this;
        self.esconder_botones = false;
        /**
         * @ngdoc function
         * @name financieraClienteApp.directive:planCuentas#seleccionar_cuenta
         * @methodOf financieraClienteApp.directive:planCuentas
         * @param {object} cuenta cuenta seleccionada en el panel
         * @description Asigna la cuenta seleccionada en el panel y lo envia a la variable del scope
         */
        self.seleccionar_cuenta = function(cuenta) {
          $scope.seleccion = cuenta;
          self.algo_fue_seleccionado = true;
          self.esconder_botones = true;
        };

        //Opciones para el componente angular-tree-control
        self.treeOptions = {
          nodeChildren: "Hijos",
          dirSelectable: true,
          injectClasses: {
            ul: "a1",
            li: "a2",
            liSelected: "a7",
            iExpanded: "a3",
            iCollapsed: "a4",
            iLeaf: "a5",
            label: "a6",
            labelSelected: "a8"
          }
        };

        $scope.vista_resumen= 'noresumen' in $attrs;
        $scope.rvdesc='rdesc' in $attrs;
        $scope.btnsel=('btnselnom' in $attrs)?$scope.btnselnom:$translate.instant('BTN.SELECCIONAR');

        /**
         * @ngdoc function
         * @name financieraClienteApp.directive:planCuentas#cargar_arbol
         * @methodOf financieraClienteApp.directive:planCuentas
         * @description Recarga la estructura del plan de cuentas con el id adquirido por el scope haciendo uso del servicio {@link financieraService.service:financieraRequest financieraRequest}
         */
        self.cargar_arbol = function() {
          $scope.load=true;
          financieraRequest.get("plan_cuentas", $.param({
            query: "Id:" + $scope.planid
          })).then(function(response) {
            self.plan = response.data[0];
            financieraRequest.get("arbol_plan_cuentas/" + self.plan.Id, "").then(function(response) {
              $scope.arbol = [];
              if (response.data !== null) {
                var cuentaPadre
                if(angular.isArray($scope.filtro)){
                  angular.forEach($scope.filtro,function(){
                    cuentaPadre = filtro.CuentaPadre
                  });
                }
                if (!angular.isUndefined($scope.filtro) && !angular.isUndefined($scope.filtro.CuentaPadre)  && !angular.isUndefined($scope.filtro.CuentaHijo)) {
                  self.cuentaPadre = $scope.filtro.CuentaPadre.Id;
                  self.cuentaHijo = $scope.filtro.CuentaHijo.Id;
                  var posP = response.data.map(function(d) { return d['Id']; }).indexOf(self.cuentaPadre);
                  var posH = response.data[posP].Hijos.map(function(d) { return d['Id']; }).indexOf(self.cuentaHijo);
                  $scope.arbol = response.data[posP].Hijos[posH];
                } else {
                  $scope.arbol = response.data;
                }
              }
              $scope.load=false;
            });
          });
        };

        /**
         * @ngdoc event
         * @name financieraClienteApp.directive:planCuentas#watch_on_recargar
         * @eventOf financieraClienteApp.directive:planCuentas
         * @param {undefined} recargar variable que activa el evento
         * @description Si la variable recargar tiene un cambio el evento se activa recargando la estructura del plan de cuentas por la funcion cargar_arbol
         */
         $scope.$watch("[recargar,planid]", function() {
           if ($scope.planid !== undefined) {
             self.cargar_arbol();
           }
         }, true);

         $scope.showSelected = function(node, $path) {
            $scope.ramasel = $path();
        };



      },
      controllerAs: 'd_planCuentas' //alias del controlador de la directiva
    };
  });
