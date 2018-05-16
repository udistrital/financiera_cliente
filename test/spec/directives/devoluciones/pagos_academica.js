'use strict';

describe('Directive: devoluciones/pagosAcademica', function () {

  // load the directive's module
  beforeEach(module('financieraClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<devoluciones/pagos-academica></devoluciones/pagos-academica>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the devoluciones/pagosAcademica directive');
  }));
});
