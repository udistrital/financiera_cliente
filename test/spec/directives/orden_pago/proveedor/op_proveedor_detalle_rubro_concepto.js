'use strict';

describe('Directive: ordenPago/proveedor/opProveedorDetalleRubroConcepto', function () {

  // load the directive's module
  beforeEach(module('financieraClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<orden-pago/proveedor/op-proveedor-detalle-rubro-concepto></orden-pago/proveedor/op-proveedor-detalle-rubro-concepto>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the ordenPago/proveedor/opProveedorDetalleRubroConcepto directive');
  }));
});
