'use strict';

describe('Controller: HomologacionConceptoHomologacionConceptoVerPorIdCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var HomologacionConceptoHomologacionConceptoVerPorIdCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HomologacionConceptoHomologacionConceptoVerPorIdCtrl = $controller('HomologacionConceptoHomologacionConceptoVerPorIdCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(HomologacionConceptoHomologacionConceptoVerPorIdCtrl.awesomeThings.length).toBe(3);
  });
});
