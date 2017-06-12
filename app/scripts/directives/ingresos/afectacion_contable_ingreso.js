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
        iddoc: '='
        movs: '=',
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
        self.movimientosregistrados = [];
        financieraRequest.get('movimiento_contable', $.param({
          limit: -1,
          query: "TipoDocumentoAfectante:" + $scope.tipodoc + ",CodigoDocumentoAfectante:" + $scope.iddoc
        })).then(function(response) {
          console.log(response.data);

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
        $scope.watch('iddoc', function() {
          self.movimientosregistrados = [];
          financieraRequest.get('movimiento_contable', $.param({
            limit: -1,
            query: "TipoDocumentoAfectante:" + $scope.tipodoc + ",CodigoDocumentoAfectante:" + $scope.iddoc
          })).then(function(response) {
            console.log(response.data);

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
        }, true);
        Array.prototype.indexOfOld = Array.prototype.indexOf

        Array.prototype.indexOf = function(e, fn) {
          if (!fn) {
            return this.indexOfOld(e)
          } else {
            if (typeof fn === 'string') {
              var att = fn;
              fn = function(e) {
                return e[att];
              }
            }
            return this.map(fn).indexOfOld(e);
          }
        };
        $scope.$watch('id', function() {
          if ($scope.id !== undefined) {
            self.movimientosregistrados = [];
            financieraRequest.get('movimiento_contable', $.param({
              limit: -1,
              query: "TipoDocumentoAfectante:" + $scope.tipodoc + ",CodigoDocumentoAfectante:" + $scope.id
            })).then(function(response) {
              console.log(response.data);
              $scope.movs = response.data;
              console.log("TipoDocumentoAfectante:" + $scope.tipodoc + ",CodigoDocumentoAfectante:" + $scope.id);
              angular.forEach(response.data, function(data) {
                if (self.movimientosregistrados.indexOf(data.Concepto.Id, 'Id')<0) {
                  var aux = angular.copy(data.Concepto);
                  aux.Cuentas = [];
                  data.CuentaContable.Debito = data.Debito;
                  data.CuentaContable.Credito = data.Credito;
                  aux.Cuentas.push(data.CuentaContable);
                  self.movimientosregistrados.push(aux);
                } else {
                  var index = self.movimientosregistrados.indexOf(data.Concepto.Id, 'Id');
                  var cuentas = angular.copy(self.movimientosregistrados[index].Cuentas);
                  if (cuentas.indexOf(data.CuentaContable.Id, 'Id')<0) {
                    data.CuentaContable.Debito = data.Debito;
                    data.CuentaContable.Credito = data.Credito;
                    cuentas.push(data.CuentaContable);
                    self.movimientosregistrados[index].Cuentas = angular.copy(cuentas);
                  } else {
                    var index = cuentas.indexOf(data.CuentaContable.Id, 'Id');
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
