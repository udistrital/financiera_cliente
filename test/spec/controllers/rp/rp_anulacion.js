'use strict';

describe('Controller: RpRpAnulacionCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var RpRpAnulacionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RpRpAnulacionCtrl = $controller('RpRpAnulacionCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RpRpAnulacionCtrl.awesomeThings.length).toBe(3);
  });
});
