// (function () {
'use strict';

var mccheterson;

angular.element(document).ready(function () {
  angular.bootstrap(document, ['app']);
});

var registroFormularioTipo = {
    input: 'input',
    fecha: 'fecha',
    tags: 'tags',
    dropdown: 'dropdown',
}

function config ($stateProvider, $urlRouterProvider, $logProvider, $httpProvider) {
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

function MainCtrl ($scope, $log) {
  $log.debug('MainCtrl loaded!');
}

function MasterCtrl ($scope, $log) {
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

function GridCtrl ($scope, $log) {
  $log.debug('GridCtrl loaded!');

  this.val="val";

  this.func = function (value) {
    this.val = value
    value = value.toUpperCase();
    return console.log(value);
  }
  this.print = function (value) {
    return console.log(value);
  }
}

function BuscadorCtrlFactory (datos) {
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

function simple($compile) {
  var bindings = {ref: '=?', bool: '=?', num:'=?', str:'=?', opt:'=?'};
  var keys = Object.keys(bindings);
  return {
    scope: {},
    controller: function(){},
    // template: function(element, attrs) {
    //   var template = "";
    //   for (var k in keys)
    //   {
    //     k = keys[k];
    //     var v = attrs[k];
    //     // if (v === undefined)
    //     template += '<input ng-model="' + k + '"></input>';
    //   }
    //   return template;
    // },
    link: function(scope, element, attrs, ctrl) {
      var k, a, s;
      for (k in keys) {
        k = keys[k];
        a = attrs[k];
        if (a.indexOf('.') > -1) {
          // Bring in changes from outside: 
          scope.$watch(k, function() {
              scope.$eval(k + ' = ' + a);
          });

          // Send out changes from inside: 
          scope.$watch(a, function(v) {
              scope[k] = v;
          });
        }
      }
    },
  }
}
simple.$inject = ['$compile'];

function buscadorFactory (configuracion) {
  var datos = configuracion || {};
  var bindings = {};
  for (var d in datos)
  {
    bindings[d] = '=?';
  }

  // Definir el controlador
  var controlador = BuscadorCtrlFactory(datos);

  var buscador = function () {
    return {
      scope: bindings,
      controller: controlador,
      restrict: 'E',
      template: function (element, attrs) {
        var template = '';
        for (var parametro in datos) {
          var dato = datos[parametro];
          template += '<input ng-model="' + parametro + '"></input>';
          template += '<label for="' + parametro + '">' + dato.label + '</label><br>'
          // //  Definir la visibilidad del campo en base a su configuración `default`:
          // // * No se definió valor: mostrar (=) u ocultar (=?) el campo en base al tipo de binding
          // // * valor es true: siempre mostrar el campo
          // // * valor es false: nunca mostrar el campo
          // // * valor es una referencia: no mostrar el campo
          // var dato = datos[parametro];
          // var valor = attrs[parametro] !== undefined
          //             ? attrs[parametro]
          //             : datos[attrs.$normalize(parametro)].default === '=';
          // // Crear un input para el campo
          // if (valor === true || valor === "=") {
          //   // Reemplazar el valor por el binding del controlador en base al tipo de dato
          //   template += '<label for="' + parametro + '">' + dato.label + '</label>' +
          //   '<input id="' + parametro + '" ng-model="' + parametro + '"/>';
          // }
          // // else if (valor !== "!")
          // // {
          // //   scope[parametro] = valor;
          // // }
        };
        // Agregar el botón de búsqueda
        template += '<button ng-click="b.buscar()">Buscar</button><br>';

        return template;
      },
      link: function (scope, element, attrs, ctrl) {
        for (var parametro in datos) {
          scope[parametro] = "";
          attrs.$set(parametro, scope[parametro]);
        }
        // for (var parametro in datos) {
        //   var valor = attrs[parametro];
        //   console.log(valor);
        //   if (valor === "=")
        //     scope[parametro] = "";
        //   else if (valor === "!")
        //     delete scope[parametro];
        // }
      }
    }
  }
  return buscador;
}

var configuracionArticulos = {
  'reqDefault': {
    default: '=',
    tipo: registroFormularioTipo.input,
    label: 'reqDefault',
  },
  'reqShow': {
    default: '=',
    tipo: registroFormularioTipo.input,
    label: 'reqShow',
  },
  'reqHide': {
    default: '=',
    tipo: registroFormularioTipo.input,
    label: 'reqHide',
  },
  'reqRef': {
    default: '=',
    tipo: registroFormularioTipo.input,
    label: 'reqRef',
  },
  'optDefault': {
    default: '!',
    tipo: registroFormularioTipo.input,
    label: 'optDefault',
  },
  'optShow': {
    default: '!',
    tipo: registroFormularioTipo.input,
    label: 'optShow',
  },
  'optHide': {
    default: '!',
    tipo: registroFormularioTipo.input,
    label: 'optHide',
  },
  'optRef': {
    default: '!',
    tipo: registroFormularioTipo.input,
    label: 'optRef',
  },
};

function buscadorClientes() {
  var configuracion = {
    'nombre': {
      default: '=',
      tipo: registroFormularioTipo.input,
      label: 'Asociaciones',
    },
    'valor': {
      default: '=?',
      tipo: registroFormularioTipo.input,
      label: 'Asociaciones',
    },
    'hue': {
      default: '=',
      tipo: registroFormularioTipo.input,
      label: 'Asociaciones',
    },
  };
  return buscador.apply(configuracion);
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
  .directive('buscadorArticulos', buscadorFactory(configuracionArticulos))
  .directive('simple', simple)
  .value('version', '1.1.0');
// })();
