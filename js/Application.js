/// <reference path='../_all.ts' />
var controllers;
(function (controllers) {
    'use strict';

    /**
    * The main controller for the app. The controller:
    * - retrieves and persists the model via the todoStorage service
    * - exposes the model to the template and provides event handlers
    */
    var EditorCtrl = (function () {
        /**
        *
        * @param $scope
        * @param componentsResource
        */
        function EditorCtrl($scope, componentsResource, codeResource) {
            this.$scope = $scope;
            this.componentsResource = componentsResource;
            this.codeResource = codeResource;
            $scope.vm = this;

            componentsResource.getComponents().then(function (result) {
                $scope.components = new model.Components(result);
                $scope.jsonComponents = $scope.components.json;
            });

            codeResource.getCode().then(function (result) {
                $scope.code = result.code;
            });

            model.Topology.getInstance().resetTopology();
            this.topology = model.Topology.getInstance();
        }
        /**
        * Create a new topology
        */
        EditorCtrl.prototype.createTopology = function () {
            model.Topology.getInstance().resetTopology();
        };

        /**
        *
        * @param targetFile
        * @returns {boolean}
        */
        EditorCtrl.prototype.saveTopology = function (targetFile) {
            return false;
        };

        /**
        *
        * @param sourceFile
        * @returns {boolean}
        */
        EditorCtrl.prototype.loadTopology = function (sourceFile) {
            return false;
        };

        /**
        * Add a new component to the topology
        * @param className Class of the new component
        * @returns {string} UUID of the new component
        */
        EditorCtrl.prototype.addComponent = function (className) {
            return model.Topology.getInstance().addComponent(className);
        };

        /**
        * Remove a given component
        * @param uuid UUID of the component to remove
        * @returns {boolean} True if it was removed, false otherwise
        */
        EditorCtrl.prototype.removeComponent = function (uuid) {
            return model.Topology.getInstance().removeComponent(uuid);
        };

        /**
        * Add a new connection between components
        * @param uuidSource UUID of the source component
        * @param uuidTarget UUID of the target component
        * @returns {boolean} True if the connection has been establish, false otherwise
        */
        EditorCtrl.prototype.addConnection = function (uuidSource, uuidTarget) {
            return model.Topology.getInstance().addConnection(uuidSource, uuidTarget);
        };

        /**
        * Remove an existent connection between components
        * @param uuidSource UUID of the source component
        * @param uuidTarget UUID of the target component
        * @returns {boolean} True if the connection has been remove, false otherwise
        */
        EditorCtrl.prototype.removeConnection = function (uuidSource, uuidTarget) {
            return model.Topology.getInstance().removeConnection(uuidSource, uuidTarget);
        };

        /**
        *
        * @returns {string[]}
        */
        EditorCtrl.prototype.topologyToCode = function () {
            var translation = [];

            if (this.translatorType == "trident")
                translation.push(model.translator.TridentTranslator.translate(model.Topology.getInstance()));
            else if (this.translatorType == "marceline")
                translation.push(model.translator.MarcelineTranslator.translate(model.Topology.getInstance()));
            else
                translation.push(model.translator.StormTranslator.translate(model.Topology.getInstance()));

            return translation;
        };

        /**
        *
        * @param type
        */
        EditorCtrl.prototype.changeTranslator = function (type) {
            this.translatorType = type;
        };
        EditorCtrl.$inject = [
            '$scope',
            'componentsResource',
            'codeResource'
        ];
        return EditorCtrl;
    })();
    controllers.EditorCtrl = EditorCtrl;
})(controllers || (controllers = {}));
/// <reference path='../_all.ts' />
var controllers;
(function (controllers) {
    'use strict';
})(controllers || (controllers = {}));
var model;
(function (model) {
    var Category = (function () {
        function Category() {
        }
        return Category;
    })();
    model.Category = Category;
})(model || (model = {}));
var model;
(function (model) {
    var Component = (function () {
        function Component() {
        }
        return Component;
    })();
    model.Component = Component;
})(model || (model = {}));
var model;
(function (model) {
    'use strict';

    /**
    * List of available components for the editor
    * @author Andrés Sánchez
    */
    var Components = (function () {
        /*
        * Create a new instance from a JSON object
        * @param srcJSON Definition of the list of components
        */
        function Components(srcJSON) {
            this._json = srcJSON;
            this._categories = srcJSON.categories;
        }
        Object.defineProperty(Components.prototype, "categories", {
            /**
            * Get the list of components
            * @returns {Category[]} A list of components
            */
            get: function () {
                return this._categories;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Components.prototype, "json", {
            /**
            * Get a JSON definition of the list of components
            * @returns {any} Definition of the list of components
            */
            get: function () {
                return this._json;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Get a component by its id
        * @param id Identifier of the component
        * @returns {Component} Component with the given id
        */
        Components.prototype.getComponentById = function (id) {
            var _this = this;
            if (this._componentById == null) {
                this._componentById = {};
                this._categories.forEach(function (category) {
                    category.components.forEach(function (component) {
                        _this._componentById[component.id] = component;
                    });
                });
            }

            return this._componentById[id];
        };
        return Components;
    })();
    model.Components = Components;
})(model || (model = {}));
var utils;
(function (utils) {
    'use strict';

    var UUID = (function () {
        function UUID() {
        }
        UUID.generate = function () {
            return UUID.s4() + UUID.s4() + '-' + UUID.s4() + '-' + UUID.s4() + '-' + UUID.s4() + '-' + UUID.s4() + UUID.s4() + UUID.s4();
        };

        UUID.s4 = function () {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        };
        return UUID;
    })();
    utils.UUID = UUID;
})(utils || (utils = {}));
/// <reference path='../utils/UUID.ts' />
var model;
(function (model) {
    'use strict';

    /**
    * The Topology class represents a Storm topology, made of
    * components and connections between those components.
    * @author Andrés Sánchez
    */
    var Topology = (function () {
        function Topology() {
        }
        /**
        * As only one topology can be modified at a time,
        * we get the same instance
        * @returns {Topology} Unique instance
        */
        Topology.getInstance = function () {
            if (this.uniqueInstance == null)
                this.uniqueInstance = new Topology();

            return this.uniqueInstance;
        };

        Object.defineProperty(Topology.prototype, "components", {
            /**
            * Get the components in the topology
            * @returns {Component[]} Components in the topology
            */
            get: function () {
                return this._components;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Topology.prototype, "connections", {
            /**
            * Get the connections in the topology
            * @returns {Connection[]} Connections in the topology
            */
            get: function () {
                return this._connections;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Reset the topology and leave it empty
        */
        Topology.prototype.resetTopology = function () {
            this._components = [];
            this._connections = [];
        };

        /**
        * Add a new component
        * @param className
        * @returns {string} UUID of the added component
        */
        Topology.prototype.addComponent = function (className) {
            var component = new model.Component();
            component.id = utils.UUID.generate();
            this._components.push(component);
            return component.id;
        };

        /**
        * Remove a component
        * @param uuid UUID of the component to remove
        * @returns {boolean} True if it was removed, false otherwise
        */
        Topology.prototype.removeComponent = function (uuid) {
            var index = -1;

            for (var i = 0; i < this._components.length; i++)
                if (this._components[i].id == uuid) {
                    index = i;
                    break;
                }

            if (index == -1)
                return false;

            this._components.splice(index, 1);
            return true;
        };

        /**
        * Add a new connection between components
        * @param uuidSource UUID of the source component
        * @param uuidTarget UUID of the target component
        * @returns {boolean} True if the connection has been establish, false otherwise
        */
        Topology.prototype.addConnection = function (uuidSource, uuidTarget) {
            var source = null;
            var target = null;

            for (var i = 0; i < this._components.length; i++) {
                if (this._components[i].id == uuidSource)
                    source = this._components[i];
                if (this._components[i].id == uuidTarget)
                    target = this._components[i];
            }

            if (source == null || target == null)
                return false;

            var connection = new model.Connection(source, target);
            this._connections.push(connection);
            return true;
        };

        /**
        * Remove an existent connection between components
        * @param uuidSource UUID of the source component
        * @param uuidTarget UUID of the target component
        * @returns {boolean} True if the connection has been remove, false otherwise
        */
        Topology.prototype.removeConnection = function (uuidSource, uuidTarget) {
            var index = -1;

            for (var i = 0; i < this._connections.length; i++) {
                if (this._connections[i].source.id == uuidSource && this._connections[i].target.id == uuidTarget) {
                    index = i;
                    break;
                }
            }

            if (index == -1)
                return false;

            this._connections.splice(index, 1);
            return true;
        };
        return Topology;
    })();
    model.Topology = Topology;
})(model || (model = {}));
/// <reference path='../_all.ts' />
var model;
(function (model) {
    'use strict';

    var Connection = (function () {
        function Connection(_source, _target) {
            this._source = _source;
            this._target = _target;
        }
        Object.defineProperty(Connection.prototype, "source", {
            /**
            * Get the source component of this connection
            * @returns {Component} Source component
            */
            get: function () {
                return this._source;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Connection.prototype, "target", {
            /**
            * Get the target component of this connection
            * @returns {Component} Target component
            */
            get: function () {
                return this._target;
            },
            enumerable: true,
            configurable: true
        });
        return Connection;
    })();
    model.Connection = Connection;
})(model || (model = {}));
/// <reference path='../Topology.ts' />
var model;
(function (model) {
    (function (translator) {
        'use strict';

        /**
        * The Translator interface must be implemented by
        * every translator from graphical view to code
        * @author Andrés Sánchez
        */
        var Translator = (function () {
            function Translator() {
            }
            /**
            * Translate a topology
            * @param topology Topology to translate
            */
            Translator.translate = function (topology) {
                return "";
            };
            return Translator;
        })();
        translator.Translator = Translator;
    })(model.translator || (model.translator = {}));
    var translator = model.translator;
})(model || (model = {}));
/// <reference path='../Topology.ts' />
/// <reference path='../Component.ts' />
/// <reference path='../Connection.ts' />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var model;
(function (model) {
    (function (translator) {
        'use strict';

        /**
        * The StormTranslator translates a topology
        * into its correspondent code in Storm
        * @author Andrés Sánchez
        */
        var StormTranslator = (function (_super) {
            __extends(StormTranslator, _super);
            function StormTranslator() {
                _super.apply(this, arguments);
            }
            /**
            * Translate a topology into Storm
            * @param topology Topology to translate
            */
            StormTranslator.translate = function (topology) {
                var translation = "Storm\n------------------\n";
                var connections = topology.connections;
                var components = topology.components;

                for (var i = 0; i < connections.length; i++) {
                    translation += "Connection\n------------------\n";
                    translation += "Source => " + connections[i].source.id + "\n";
                    translation += "Target => " + connections[i].target.id + "\n";
                    translation += "------------------\n";
                }

                for (var i = 0; i < components.length; i++) {
                    translation += "Component\n------------------\n";
                    translation += "Id => " + components[i].id + "\n";
                    translation += "------------------\n";
                }

                return translation;
            };
            return StormTranslator;
        })(translator.Translator);
        translator.StormTranslator = StormTranslator;
    })(model.translator || (model.translator = {}));
    var translator = model.translator;
})(model || (model = {}));
/// <reference path='../Topology.ts' />
/// <reference path='../Component.ts' />
/// <reference path='../Connection.ts' />
var model;
(function (model) {
    (function (translator) {
        'use strict';

        /**
        * The TridentTranslator translates a topology
        * into its correspondent code in Trident
        * @author Andrés Sánchez
        */
        var TridentTranslator = (function (_super) {
            __extends(TridentTranslator, _super);
            function TridentTranslator() {
                _super.apply(this, arguments);
            }
            /**
            * Translate a topology into Trident
            * @param topology Topology to translate
            */
            TridentTranslator.translate = function (topology) {
                var translation = "Trident\n------------------\n";
                var connections = topology.connections;
                var components = topology.components;

                for (var i = 0; i < connections.length; i++) {
                    translation += "Connection\n------------------\n";
                    translation += "Source => " + connections[i].source.id + "\n";
                    translation += "Target => " + connections[i].target.id + "\n";
                    translation += "------------------\n";
                }

                for (var i = 0; i < components.length; i++) {
                    translation += "Component\n------------------\n";
                    translation += "Id => " + components[i].id + "\n";
                    translation += "------------------\n";
                }

                return translation;
            };
            return TridentTranslator;
        })(translator.Translator);
        translator.TridentTranslator = TridentTranslator;
    })(model.translator || (model.translator = {}));
    var translator = model.translator;
})(model || (model = {}));
/// <reference path='../Topology.ts' />
/// <reference path='../Component.ts' />
/// <reference path='../Connection.ts' />
var model;
(function (model) {
    (function (translator) {
        'use strict';

        /**
        * The MarcelineTranslator translates a topology
        * into its correspondent code in Marceline
        * @author Andrés Sánchez
        */
        var MarcelineTranslator = (function (_super) {
            __extends(MarcelineTranslator, _super);
            function MarcelineTranslator() {
                _super.apply(this, arguments);
            }
            /**
            * Translate a topology into Marceline
            * @param topology Topology to translate
            */
            MarcelineTranslator.translate = function (topology) {
                var translation = "Marceline\n------------------\n";
                var connections = topology.connections;
                var components = topology.components;

                for (var i = 0; i < connections.length; i++) {
                    translation += "Connection\n------------------\n";
                    translation += "Source => " + connections[i].source.id + "\n";
                    translation += "Target => " + connections[i].target.id + "\n";
                    translation += "------------------\n";
                }

                for (var i = 0; i < components.length; i++) {
                    translation += "Component\n------------------\n";
                    translation += "Id => " + components[i].id + "\n";
                    translation += "------------------\n";
                }

                return translation;
            };
            return MarcelineTranslator;
        })(translator.Translator);
        translator.MarcelineTranslator = MarcelineTranslator;
    })(model.translator || (model.translator = {}));
    var translator = model.translator;
})(model || (model = {}));
/// <reference path='../_all.ts' />
var services;
(function (services) {
    'use strict';

    var ComponentsResource = (function () {
        function ComponentsResource($resource) {
            this.$resource = $resource;
        }
        ComponentsResource.prototype.getComponents = function () {
            return this.$resource('api/components.json').get().$get();
        };
        ComponentsResource.$inject = [
            '$resource'
        ];
        return ComponentsResource;
    })();
    services.ComponentsResource = ComponentsResource;
})(services || (services = {}));
/// <reference path='../_all.ts' />
var services;
(function (services) {
    'use strict';

    var CodeResource = (function () {
        function CodeResource($resource) {
            this.$resource = $resource;
        }
        CodeResource.prototype.getCode = function () {
            return this.$resource('api/code.json').get().$get();
        };
        CodeResource.$inject = [
            '$resource'
        ];
        return CodeResource;
    })();
    services.CodeResource = CodeResource;
})(services || (services = {}));
/// <reference path='libs/angular/angular.d.ts' />
/// <reference path='libs/angular/angular-resource.d.ts' />
/// <reference path='controllers/EditorCtrl.ts' />
/// <reference path='interfaces/IEditorScope.ts' />
/// <reference path='model/Category.ts' />
/// <reference path='model/Component.ts' />
/// <reference path='model/Components.ts' />
/// <reference path='model/Topology.ts' />
/// <reference path='model/Connection.ts' />
/// <reference path='model/translator/Translator.ts' />
/// <reference path='model/translator/StormTranslator.ts' />
/// <reference path='model/translator/TridentTranslator.ts' />
/// <reference path='model/translator/MarcelineTranslator.ts' />
/// <reference path='services/ComponentsResource.ts' />
/// <reference path='services/CodeResource.ts' />
/// <reference path='Application.ts' />
/// <reference path='_all.ts' />
'use strict';
var zirimiriEditor = angular.module('zirimiriEditor', ['ngResource']).controller('editorCtrl', controllers.EditorCtrl).service('componentsResource', services.ComponentsResource).service('codeResource', services.CodeResource);
