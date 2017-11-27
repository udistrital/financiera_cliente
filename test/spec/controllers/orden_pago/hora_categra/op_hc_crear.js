'use strict';

describe('Controller: OrdenPagoHoraCategraOpHcCrearCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var OrdenPagoHoraCategraOpHcCrearCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OrdenPagoHoraCategraOpHcCrearCtrl = $controller('OrdenPagoHoraCategraOpHcCrearCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(OrdenPagoHoraCategraOpHcCrearCtrl.awesomeThings.length).toBe(3);
  });
});
