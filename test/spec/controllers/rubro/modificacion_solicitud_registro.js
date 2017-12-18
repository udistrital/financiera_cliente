'use strict';

describe('Controller: RubroModificacionSolicitudRegistroCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var RubroModificacionSolicitudRegistroCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RubroModificacionSolicitudRegistroCtrl = $controller('RubroModificacionSolicitudRegistroCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RubroModificacionSolicitudRegistroCtrl.awesomeThings.length).toBe(3);
  });
});
