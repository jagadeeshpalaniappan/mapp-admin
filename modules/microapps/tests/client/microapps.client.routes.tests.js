(function () {
  'use strict';

  describe('MicroApps Route Tests', function () {
    // Initialize global variables
    var $scope,
      MicroAppsService;

    // We can start by loading the main application module
    beforeEach(module(RootApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ArticlesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      MicroAppsService = _ArticlesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('microapps');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/microapps');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('microapps.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/microapps/client/views/list-microapps.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          MicroAppsController,
          mockArticle;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('microapps.view');
          $templateCache.put('/modules/microapps/client/views/view-microapps.client.view.html', '');

          // create mock microapp
          mockArticle = new MicroAppsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An MicroApp about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          MicroAppsController = $controller('MicroAppsController as vm', {
            $scope: $scope,
            microAppResolve: mockArticle
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:microAppId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.microAppResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            microAppId: 1
          })).toEqual('/microapps/1');
        }));

        it('should attach an microapp to the controller scope', function () {
          expect($scope.vm.microApp._id).toBe(mockArticle._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/microapps/client/views/view-microapps.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/microapps/client/views/list-microapps.client.view.html', '');

          $state.go('microapps.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('microapps/');
          $rootScope.$digest();

          expect($location.path()).toBe('/microapps');
          expect($state.current.templateUrl).toBe('/modules/microapps/client/views/list-microapps.client.view.html');
        }));
      });
    });
  });
}());
