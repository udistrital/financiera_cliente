'use strict';

describe('Directive: cuentasContables/verDescuentos', function () {

  // load the directive's module
  beforeEach(module('financieraClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<cuentas-contables/ver-descuentos></cuentas-contables/ver-descuentos>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the cuentasContables/verDescuentos directive');
  }));
});
