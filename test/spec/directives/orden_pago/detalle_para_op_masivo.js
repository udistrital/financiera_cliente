'use strict';

describe('Directive: ordenPago/detalleParaOpMasivo', function () {

  // load the directive's module
  beforeEach(module('financieraClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<orden-pago/detalle-para-op-masivo></orden-pago/detalle-para-op-masivo>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the ordenPago/detalleParaOpMasivo directive');
  }));
});
