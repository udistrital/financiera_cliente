'use strict';

describe('Controller: RpRpSolicitudConsultaCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var RpRpSolicitudConsultaCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RpRpSolicitudConsultaCtrl = $controller('RpRpSolicitudConsultaCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RpRpSolicitudConsultaCtrl.awesomeThings.length).toBe(3);
  });
});
