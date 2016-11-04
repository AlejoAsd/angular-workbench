// (function () {
'use strict';

angular.element(document).ready(function () {
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

  this.click = function (v) {
    $log.debug(v);
  }
}

function GridCtrl($scope, $log) {
  $log.debug('GridCtrl loaded!');
  this.func = function (value) {
    this.val = value
    value = value.toUpperCase();
    return console.log(value);
  }
  this.print = function (value) {
    return console.log(value);
  }
}

function BuscadorCtrlFactory(bindings) {
  return function BuscadorCtrl() {
    this.resultados = [];
    this.bindings = bindings;

    // Funciones
    this.buscar = function (value) {
      console.log(value.toUpperCase());
    };

    this.seleccionar = function (objeto) {
      this.seleccionado = objeto;
    };

    /**
     * Genera las cláusulas de búsqueda en base a los bindings definidos para
     * el buscador.
     */
    this.generarClausulas = function () {}
  };
}

function buscador() {
  // Definir los bindings correspondientes al buscador
  var bindingsGenerales = {
    'seleccionado': '='
  };
  var bindings = angular.extend(this.bindings || {}, bindingsGenerales);

  // Definir el controlador
  var controlador = BuscadorCtrlFactory(bindings);

  // Eliminar las entradas $ de los bindings
  for (var key in bindings) {
    if (bindings[key] == '$') delete bindings[key];
  }

  return {
    controller: controlador,
    controllerAs: 'b',
    bindToController: bindings,
    restrict: 'E',
    scope: {},
    template: [
      '<input ng-model="b.seleccionado">',
      '<button ng-click="b.f(this)">Buscar</button>',
      '<br>'
    ].join(''),
  };
}

function buscadorArticulos() {
  var configuracion = {
    bindings: {
      'valor': '='
    }
  };
  return buscador.apply(configuracion);
}

function objectsHaveSameKeys(...objects) {
   const allKeys = objects.reduce((keys, object) => keys.concat(Object.keys(object)), []);
   const union = new Set(allKeys);
   return objects.every(object => union.size === Object.keys(object).length);
}

function buscadorConfigurable() {
  var bindings = {
    'req-default': '=',
    'req-show': '=',
    'req-hide': '=',
    'req-ref': '=',
    'opt-default': '=?',
    'opt-show': '=?',
    'opt-hide': '=?',
    'opt-ref': '=?',
  }
  return {
    controller: function () {},
    controllerAs: 'c',
    bindToController: bindings,
    link: function (scope, element, attrs, ctrl) {
      for (var attr in attrs.$attr) {
        var nombre = attr;
        attr = attrs[attr];
        // Crear un input para el campo
        if (attr === "=" || attr === undefined) {
          element.append('<input name=' + nombre + '/>');
        }
        // No mostrar el campo en el buscador
        else if (attr === "!") {
          console.log('Not showing ' + nombre);
        }
      };
    }
  }
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
  .directive('buscador', buscadorArticulos)
  .directive('buscadorConfigurable', buscadorConfigurable)
  .value('version', '1.1.0');
// })();
