'use strict';

describe('Directive: cuentasContables/movimientosContablesOpDetalle', function () {

  // load the directive's module
  beforeEach(module('financieraClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<cuentas-contables/movimientos-contables-op-detalle></cuentas-contables/movimientos-contables-op-detalle>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the cuentasContables/movimientosContablesOpDetalle directive');
  }));
});
