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
    this.buscar = function () {
      var datos = {}
      for (var parametro in this.bindings) {
        parametro = this.bindings[parametro];
        var valor = this[parametro];
        
        if (valor !== undefined)
          datos[parametro] = valor;
      }
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

function buscadorConfigurable() {
  // Definir los bindings correspondientes al buscador
  var bindingsGenerales = {
    'seleccionado': '='
  };
  var bindings = angular.extend(this.bindings || {}, bindingsGenerales);

  // Definir el controlador
  var controlador = BuscadorCtrlFactory(Object.keys(bindings));

  return {
    scope: {},    
    controller: controlador,
    controllerAs: 'b',
    restrict: 'E',
    template: function (element, attrs) {
      var template = '';
      for (var parametro in bindings) {
        // No mostrar el objeto seleccionado
        if (parametro === "seleccionado") continue;

        //  Definir la visibilidad del campo:
        // * No se definió valor: mostrar (=) u ocultar (=?) el campo en base al tipo de binding
        // * valor es true: siempre mostrar el campo
        // * valor es false: nunca mostrar el campo
        // * valor es una referencia: no mostrar el campo
        var valor = attrs[parametro] !== undefined
                    ? attrs[parametro]
                    : bindings[attrs.$normalize(parametro)] === '=';
        // Crear un input para el campo
        if (valor === true || valor === "true") {
          // Reemplazar el valor por el binding del controlador
          // attrs.$set(parametro, parametro);
          template += '<input name="' + parametro + '" ng-model="b.' + parametro + '"/>';
        }
      };
      // Agregar el botón de búsqueda
      template += '<button ng-click="b.buscar()">Buscar</button><br>';

      return template;
    },
  }
}

function buscadorArticulos() {
  var configuracion = {
    bindings: {
      'reqDefault': '=',
      'reqShow': '=',
      'reqHide': '=',
      'reqRef': '=',
      'optDefault': '=?',
      'optShow': '=?',
      'optHide': '=?',
      'optRef': '=?',
    }
  };
  return buscadorConfigurable.apply(configuracion);
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
  .value('version', '1.1.0');
// })();
