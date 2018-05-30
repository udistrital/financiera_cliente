'use strict';

describe('Controller: DevolucionesParametrosactasCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var DevolucionesParametrosactasCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DevolucionesParametrosactasCtrl = $controller('DevolucionesParametrosactasCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DevolucionesParametrosactasCtrl.awesomeThings.length).toBe(3);
  });
});
