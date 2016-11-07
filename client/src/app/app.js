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
    this.bindings = angular.copy(bindings);

    // Funciones
    this.buscar = function () {
      console.log(this.bindings);
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
  var controlador = BuscadorCtrlFactory(bindings);

  return {
    scope: bindings,    
    controller: controlador,
    controllerAs: 'b',
    restrict: 'E',
    template: function (element, attrs) {
      var template = '';
      for (var valor in bindings) {
        // No mostrar el objeto seleccionado
        if (valor === "seleccionado") continue;

        var nombre = valor;

        //  Definir la visibilidad del campo:
        // * No se definió valor: mostrar (=) u ocultar (=?) el campo en base al tipo de binding
        // * valor es true: siempre mostrar el campo
        // * valor es false: nunca mostrar el campo
        // * valor es una referencia: no mostrar el campo
        valor = attrs[valor] !== undefined
                ? attrs[valor]
                : bindings[attrs.$normalize(valor)] === '=';
        // Crear un input para el campo
        if (valor === true || valor === "true") {
          // Reemplazar el valor por el binding del controlador
          // attrs.$set(nombre, nombre);
          template += '<input name="' + nombre + '" ng-model="' + nombre + '"/>';
          console.log(nombre);
        }
        else if (valor === false || valor === "false") {
          // Eliminar el binding para el campo explícitamente oculto
          delete(bindings[nombre]);
          attrs.$set(nombre, null);
        }
      };
      // Agregar el botón de búsqueda
      template += '<button ng-click="buscar()">Buscar</button><br>';

      return template;
    },
    link: function(scope, element, attrs) {
      for (var nombre in bindings){
        scope[nombre] = "";
      }
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
