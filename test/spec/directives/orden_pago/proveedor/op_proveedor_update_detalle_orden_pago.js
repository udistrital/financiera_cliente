'use strict';

describe('Directive: ordenPago/proveedor/opProveedorUpdateDetalleOrdenPago', function () {

  // load the directive's module
  beforeEach(module('financieraClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<orden-pago/proveedor/op-proveedor-update-detalle-orden-pago></orden-pago/proveedor/op-proveedor-update-detalle-orden-pago>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the ordenPago/proveedor/opProveedorUpdateDetalleOrdenPago directive');
  }));
});
