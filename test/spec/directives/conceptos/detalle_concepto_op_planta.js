'use strict';

describe('Directive: conceptos/detalleConceptoOpPlanta', function () {

  // load the directive's module
  beforeEach(module('financieraClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<conceptos/detalle-concepto-op-planta></conceptos/detalle-concepto-op-planta>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the conceptos/detalleConceptoOpPlanta directive');
  }));
});
