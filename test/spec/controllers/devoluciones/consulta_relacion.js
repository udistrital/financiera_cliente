'use strict';

describe('Controller: DevolucionesConsultaRelacionCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var DevolucionesConsultaRelacionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DevolucionesConsultaRelacionCtrl = $controller('DevolucionesConsultaRelacionCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DevolucionesConsultaRelacionCtrl.awesomeThings.length).toBe(3);
  });
});
