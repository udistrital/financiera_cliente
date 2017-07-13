'use strict';

describe('Controller: OrdenPagoSeguridadSocialOpSeguridadSocialVerPorIdCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var OrdenPagoSeguridadSocialOpSeguridadSocialVerPorIdCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OrdenPagoSeguridadSocialOpSeguridadSocialVerPorIdCtrl = $controller('OrdenPagoSeguridadSocialOpSeguridadSocialVerPorIdCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(OrdenPagoSeguridadSocialOpSeguridadSocialVerPorIdCtrl.awesomeThings.length).toBe(3);
  });
});
