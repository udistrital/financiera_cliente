'use strict';

describe('Controller: DevolucionesParametrosActasCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var DevolucionesParametrosActasCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DevolucionesParametrosActasCtrl = $controller('DevolucionesParametrosActasCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DevolucionesParametrosActasCtrl.awesomeThings.length).toBe(3);
  });
});
