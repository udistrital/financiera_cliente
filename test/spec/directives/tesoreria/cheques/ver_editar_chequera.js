'use strict';

describe('Directive: tesoreria/cheques/verEditarChequera', function () {

  // load the directive's module
  beforeEach(module('financieraClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<tesoreria/cheques/ver-editar-chequera></tesoreria/cheques/ver-editar-chequera>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the tesoreria/cheques/verEditarChequera directive');
  }));
});
