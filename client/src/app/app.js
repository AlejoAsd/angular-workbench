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

function BuscadorCtrlFactory(datos) {
  return function BuscadorCtrl() {
    this.resultados = [];
    this.nombresDatos = Object.keys(datos);

    // Funciones
    this.buscar = function () {
      var datos = {}
      for (var parametro in this.nombresDatos) {
        parametro = this.nombresDatos[parametro];
        var valor = this[parametro];
        
        if (valor !== undefined)
          datos[parametro] = valor;
      }
      // Realizar el request
      // TODO
      console.log(datos);
    };

    this.seleccionar = function (objeto) {
      this.seleccionado = objeto;
    };
  };
}

function buscadorBase() {
  // Definir los datos correspondientes al buscador
  var datos = this || {};

  // Definir el controlador
  var controlador = BuscadorCtrlFactory(datos);

  return {
    scope: {},
    controller: controlador,
    controllerAs: 'b',
    restrict: 'E',
    template: function (element, attrs) {
      var template = '';
      for (var parametro in datos) {
        //  Definir la visibilidad del campo en base a su configuración `default`:
        // * No se definió valor: mostrar (=) u ocultar (=?) el campo en base al tipo de binding
        // * valor es true: siempre mostrar el campo
        // * valor es false: nunca mostrar el campo
        // * valor es una referencia: no mostrar el campo
        var valor = attrs[parametro] !== undefined
                    ? attrs[parametro]
                    : datos[attrs.$normalize(parametro)].default === '=';
        // Crear un input para el campo
        if (valor === true || valor === "=") {
          // Reemplazar el valor por el binding del controlador en base al tipo de dato
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
    'reqDefault': {
      default: '=',
      tipo: '',
      label: 'Asociaciones',
    },
    'reqShow': {
      default: '=',
      tipo: '',
      label: 'Asociaciones',
    },
    'reqHide': {
      default: '=',
      tipo: '',
      label: 'Asociaciones',
    },
    'reqRef': {
      default: '=',
      tipo: '',
      label: 'Asociaciones',
    },
    'optDefault': {
      default: '=?',
      tipo: '',
      label: 'Asociaciones',
    },
    'optShow': {
      default: '=?',
      tipo: '',
      label: 'Asociaciones',
    },
    'optHide': {
      default: '=?',
      tipo: '',
      label: 'Asociaciones',
    },
    'optRef': {
      default: '=?',
      tipo: '',
      label: 'Asociaciones',
    },
  };
  return buscadorBase.apply(configuracion);
}

function buscadorClientes() {
  var configuracion = {
    'nombre': {
      default: '=',
      tipo: '',
      label: 'Asociaciones',
    },
    'valor': {
      default: '=?',
      tipo: '',
      label: 'Asociaciones',
    },
    'hue': {
      default: '=',
      tipo: '',
      label: 'Asociaciones',
    },
  };
  return buscadorBase.apply(configuracion);
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
  .directive('buscadorArticulos', buscadorArticulos)
  .directive('buscadorClientes', buscadorClientes)
  .value('version', '1.1.0');
// })();
