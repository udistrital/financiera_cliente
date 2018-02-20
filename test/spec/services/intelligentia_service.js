'use strict';

describe('Service: intelligentiaService', function () {

  // load the service's module
  beforeEach(module('financieraClienteApp'));

  // instantiate service
  var intelligentiaService;
  beforeEach(inject(function (_intelligentiaService_) {
    intelligentiaService = _intelligentiaService_;
  }));

  it('should do something', function () {
    expect(!!intelligentiaService).toBe(true);
  });

});
