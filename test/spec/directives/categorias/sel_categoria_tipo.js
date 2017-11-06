'use strict';

describe('Directive: categorias/selCategoriaTipo', function () {

  // load the directive's module
  beforeEach(module('financieraClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<categorias/sel-categoria-tipo></categorias/sel-categoria-tipo>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the categorias/selCategoriaTipo directive');
  }));
});
