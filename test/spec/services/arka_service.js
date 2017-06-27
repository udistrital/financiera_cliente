'use strict';

describe('Service: arkaService', function () {

  // load the service's module
  beforeEach(module('financieraClienteApp'));

  // instantiate service
  var arkaService;
  beforeEach(inject(function (_arkaService_) {
    arkaService = _arkaService_;
  }));

  it('should do something', function () {
    expect(!!arkaService).toBe(true);
  });

});
