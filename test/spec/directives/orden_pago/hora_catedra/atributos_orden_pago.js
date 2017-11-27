'use strict';

describe('Directive: ordenPago/horaCatedra/atributosOrdenPago', function () {

  // load the directive's module
  beforeEach(module('financieraClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<orden-pago/hora-catedra/atributos-orden-pago></orden-pago/hora-catedra/atributos-orden-pago>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the ordenPago/horaCatedra/atributosOrdenPago directive');
  }));
});
