'use strict';

describe('Controller: CompromisosListadoCompromisosCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var CompromisosListadoCompromisosCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CompromisosListadoCompromisosCtrl = $controller('CompromisosListadoCompromisosCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CompromisosListadoCompromisosCtrl.awesomeThings.length).toBe(3);
  });
});
