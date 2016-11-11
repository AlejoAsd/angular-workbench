// (function () {
'use strict';

var mccheterson;

angular.element(document).ready(function () {
  angular.bootstrap(document, ['app']);
});

var registroFormularioTipo = {
    input: 'input',
    fecha: 'fecha',
    checkbox: 'checkbox',
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
    this.nombresDatos = Object.campos(datos);

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

/*
 * Define los inputs y datos que están asociados a cada campo. Dependiendo 
 * del dato definido para el campo, se tienen distintos comportamientos:
 * undefined 
 *   Este caso sucede cuando no se define el campo en la directiva. Se 
 *   utiliza la entrada `default` de la configuración para determinar el 
 *   comportamiento. El valor contenido en `default` es utilizado como 
 *   el valor para el atributo indefinido. Por lo tanto, se pueden 
 *   definir cualquiera de las siguientes configuraciones como la default
 *   para determinar el comportamiento.
 * '='
 *   Se crea un input para cargar datos. El tipo de input es definido la
 *   entrada `tipo` de la configuración del campo.
 * '!' 
 *   No se crea un input para cargar datos. No se asigna un valor al 
 *   campo. 
 * '*.*'
 *   Si se provee una cadena que contiene un punto, se asume que se
 *   trata de una referencia. No se crea un input para el campo, pero se
 *   crea un binding de un sentido de la referencia al campo. Es decir, 
 *   el campo siempre va a contener el mismo valor que la referencia, 
 *   pero es incapaz de mutar la referencia. Es posible hacer una 
 *   referencia a valores de campos del buscador por medio de un valor 
 *   del tipo 'this.*', donde * es el nombre del campo del que se quiere 
 *   la referencia.
 * otros: 
 *   Cualquier otro valor se toma como valor literal. No se crea un
 *   input, y se asigna el valor literal al campo.
 */
function simple() {
  var campos = {
    'ref': {
      tipo: registroFormularioTipo.input,
      default: '=',
      label: 'ref',
    }, 
    'bool': {
      tipo: registroFormularioTipo.checkbox,
      default: '=',
      label: 'bool',
    }, 
    'num': {
      tipo: registroFormularioTipo.input,
      default: '=',
      label: 'num',
    }, 
    'str': {
      tipo: registroFormularioTipo.input,
      default: '=',
      label: 'str',
    }, 
    'opt': {
      tipo: registroFormularioTipo.input,
      default: '=',
      label: 'opt',
    }
  };
  var tipoCampo = {};
  var refList = {};
  return {
    scope: true,
    controller: function(){},
    template: function(element, attrs) {
      var template = "";
      var campo, tipo, valor, dato;
      for (campo in campos)
      {
        valor = attrs[campo];
        dato = campos[campo]

        // Definir el tipo de atributo
        //  Default
        //  Asignar el valor default de la configuración antes de procesar
        if (valor === undefined)
          valor = dato.default;
        //  Input
        if (valor === "=")
        {
          tipo = "=";
        }
        //  Referencia
        else if (valor.indexOf('.') !== -1)
        {
          tipo = ".";
          // Agregar a la lista de referencias
          if (refList[valor] === undefined)
            refList[valor] = [campo];
          else
            refList[valor].push(campo);
        }
        //  Sin input
        else
        {
          tipo = "!";
        }
        tipoCampo[campo] = tipo;

        // Crear el template
        if (tipo === "=")
        {
          template += '<input ng-model="' + campo + '"></input>';
          template += '<label>' + dato.label + '</label><br>';
        }
      }
      return template;
    },
    link: function(scope, element, attrs, ctrl) {
      var campo, tipo, valor;
      for (campo in campos) {
        valor = attrs[campo];
        tipo = tipoCampo[campo];

        // Atribuir el valor en base al tipo de atributo
        //  Input
        if (tipo === '=') {
          scope[campo] = "";
        }
        // Otro valor
        else if (tipo !== '!') {
          // Obtener los cambios de la referencia
          scope[campo] = valor;
        }
      }
      // Crear un binding de un sentido de la referencia a los valores
      for (campo in refList) {
        scope.$watch(campo, function(v) {
          for (var ref in refList[campo])
          { 
            ref = refList[campo][ref];
            scope[ref] = v;
          }
        });
      }
    },
  }
}

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
