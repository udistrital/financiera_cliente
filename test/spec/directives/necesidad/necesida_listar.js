'use strict';

describe('Directive: necesidad/necesidaListar', function () {

  // load the directive's module
  beforeEach(module('financieraClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<necesidad/necesida-listar></necesidad/necesida-listar>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the necesidad/necesidaListar directive');
  }));
});
