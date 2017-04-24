'use strict';

describe('Controller: CdpCdpAnulacionCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var CdpCdpAnulacionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CdpCdpAnulacionCtrl = $controller('CdpCdpAnulacionCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CdpCdpAnulacionCtrl.awesomeThings.length).toBe(3);
  });
});
