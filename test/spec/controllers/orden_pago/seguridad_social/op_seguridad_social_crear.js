'use strict';

describe('Controller: OrdenPagoSeguridadSocialOpSeguridadSocialCrearCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var OrdenPagoSeguridadSocialOpSeguridadSocialCrearCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OrdenPagoSeguridadSocialOpSeguridadSocialCrearCtrl = $controller('OrdenPagoSeguridadSocialOpSeguridadSocialCrearCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(OrdenPagoSeguridadSocialOpSeguridadSocialCrearCtrl.awesomeThings.length).toBe(3);
  });
});
