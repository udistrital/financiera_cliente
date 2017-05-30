'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:ingresos/afectacionContableIngreso
 * @description
 * # ingresos/afectacionContableIngreso
 */
angular.module('financieraClienteApp')
  .directive('afectacionContableIngreso', function(financieraRequest) {
    return {
      restrict: 'E',
      scope: {
        obs: '=',
        tipodoc: '=',
        id: '=?'
      },

      templateUrl: 'views/directives/ingresos/afectacion_contable_ingreso.html',
      controller: function($scope) {
        var self = this;
        self.findIndex = function(data, property, value) {
          for (var i = 0, l = data.length; i < l; i++) {
            if (data[i][property] === value) {
              return i;
            }
          }
          return -1;
        }
        $scope.$watch('id', function() {
          if($scope.id !== undefined){
            self.movimientosregistrados = [];
            financieraRequest.get('movimiento_contable', $.param({
              limit: -1,
              query: "TipoDocumentoAfectante:" + $scope.tipodoc + ",CodigoDocumentoAfectante:" + $scope.id
            })).then(function(response) {
              console.log(response.data);
              console.log("TipoDocumentoAfectante:" + $scope.tipodoc + ",CodigoDocumentoAfectante:" + $scope.id);
              angular.forEach(response.data, function(data) {
                if (!self.movimientosregistrados.some(item => item.Id === data.Concepto.Id)) {
                  var aux = angular.copy(data.Concepto);
                  aux.Cuentas = [];
                  data.CuentaContable.Debito = data.Debito;
                  data.CuentaContable.Credito = data.Credito;
                  aux.Cuentas.push(data.CuentaContable);
                  self.movimientosregistrados.push(aux);
                } else {
                  var index = self.movimientosregistrados.findIndex(x => x.Id == data.Concepto.Id);
                  var cuentas = angular.copy(self.movimientosregistrados[index].Cuentas);
                  if (!cuentas.some(item => item.Id === data.CuentaContable.Id)) {
                    data.CuentaContable.Debito = data.Debito;
                    data.CuentaContable.Credito = data.Credito;
                    cuentas.push(data.CuentaContable);
                    self.movimientosregistrados[index].Cuentas = angular.copy(cuentas);
                  } else {
                    var index = cuentas.findIndex(x => x.Id === data.CuentaContable.Id);
                    cuentas[index].Debito = cuentas[index].Debito + data.Debito;
                    cuentas[index].Credito = cuentas[index].Credito + data.Credito;
                    self.movimientosregistrados[index].Cuentas = angular.copy(cuentas);
                  }
                }
              });
            });
          }


        });
      },
      controllerAs: 'd_afectacionContableIngreso'
    };
  });
