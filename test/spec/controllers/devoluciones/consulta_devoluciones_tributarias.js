'use strict';

describe('Controller: DevolucionesConsultaDevolucionesTributariasCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var DevolucionesConsultaDevolucionesTributariasCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DevolucionesConsultaDevolucionesTributariasCtrl = $controller('DevolucionesConsultaDevolucionesTributariasCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DevolucionesConsultaDevolucionesTributariasCtrl.awesomeThings.length).toBe(3);
  });
});
