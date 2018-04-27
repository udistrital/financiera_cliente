'use strict';

describe('Controller: DevolucionesNoTributariaCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var DevolucionesNoTributariaCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DevolucionesNoTributariaCtrl = $controller('DevolucionesNoTributariaCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DevolucionesNoTributariaCtrl.awesomeThings.length).toBe(3);
  });
});
