'use strict';

describe('Directive: tesoreria/cheques/verEditarCheque', function () {

  // load the directive's module
  beforeEach(module('financieraClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<tesoreria/cheques/ver-editar-cheque></tesoreria/cheques/ver-editar-cheque>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the tesoreria/cheques/verEditarCheque directive');
  }));
});
