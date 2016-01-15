(function() {
  'use strict';

  angular.element(document).ready(function() {
    angular.bootstrap(document, ['app']);
  });

  function config($stateProvider, $urlRouterProvider, $logProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/');
    $logProvider.debugEnabled(true);
    $httpProvider.interceptors.push('httpInterceptor');
    $stateProvider
      .state('root', {
        views: {
          'header': {
            templateUrl: 'src/common/header.tpl.html',
            controller: 'HeaderCtrl'
          },
          'footer': {
            templateUrl: 'src/common/footer.tpl.html',
            controller: 'FooterCtrl'
          }
        }
      });
  }

  function MainCtrl($scope, $log) {
    $log.debug('MainCtrl loaded!');
  }

  function MasterCtrl($scope, $log) {
    $log.debug('MasterCtrl loaded!');

    $scope.list = [
      1,
      2,
      3
    ]

    $scope.value = 10

    this.click = function(v)
    {
      $log.debug(v);
    }
  }

  function GridCtrl($scope, $log) {
    $log.debug('GridCtrl loaded!');
  }

  function ElementCtrl($scope, $log) {
    $log.debug('ElementCtrl loaded!')
  }

  function grid() {
    return {
      restrict: 'E',
      template: [
        '<p>',
        'Grid',
        '</p>'
      ].join('')
    };
  }

  function list() {
    return {
      restrict: 'E',
      controller: ['$scope', '$log', ElementCtrl],
      controllerAs: 'element',
      template: [
        '<ul>',
        '<li ng-repeat="e in list">',
        '{{ e }}',
        '</li>',
        '</ul>'
      ].join('')
    };
  }

  function inputForm() {
    return {
      restrict: 'E',
      controller: ['$scope', '$log', ElementCtrl],
      controllerAs: 'element',
      template: [
        '<form>',
        '<label for="field">Field</label>',
        '<input id="field" ng-model="list[0]"></input>',
        '</form>'
      ].join('')
    };
  }  

  function run($log) {
    $log.debug('App is running!');
  }

  angular.module('app', [
      'ui.router',
      'home',
      'getting-started',
      'common.header',
      'common.footer',
      'common.services.data',
      'common.directives.version',
      'common.filters.uppercase',
      'common.interceptors.http',
      'templates'
    ])
    .config(config)
    .run(run)
    .controller('MainCtrl', ['$scope', '$log', MainCtrl])
    .controller('MasterCtrl', ['$scope', '$log', MasterCtrl])
    .controller('GridCtrl', ['$scope', '$log', GridCtrl])
    .directive('grid', grid)
    .directive('list', list)
    .directive('inputForm', inputForm)
    .value('version', '1.1.0');
})();
