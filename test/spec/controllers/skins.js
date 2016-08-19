'use strict';

describe('Controller: SkinsCtrl', function () {

  // load the controller's module
  beforeEach(module('lambSkinsApp'));

  var SkinsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SkinsCtrl = $controller('SkinsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SkinsCtrl.awesomeThings.length).toBe(3);
  });
});
