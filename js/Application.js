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
            console.log("Created topology!");
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
            console.log(className);
            return model.Topology.getInstance().addComponent(className);
        };

        /**
        *
        * @param uuid
        * @returns {boolean}
        */
        EditorCtrl.prototype.removeComponent = function (uuid) {
            return false;
        };

        /**
        *
        * @param uuidSource
        * @param uuidTarget
        * @returns {boolean}
        */
        EditorCtrl.prototype.addConnection = function (uuidSource, uuidTarget) {
            return false;
        };

        /**
        *
        * @param uuidSource
        * @param uuidTarget
        * @returns {boolean}
        */
        EditorCtrl.prototype.removeConnection = function (uuidSource, uuidTarget) {
            return false;
        };

        /**
        *
        * @returns {string[]}
        */
        EditorCtrl.prototype.topologyToCode = function () {
            return null;
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

        /**
        * Reset the topology and leave it empty
        */
        Topology.prototype.resetTopology = function () {
            this.components = [];
            this.connections = [];
        };

        /**
        * Add a new component
        * @param className
        * @returns {string} UUID of the added component
        */
        Topology.prototype.addComponent = function (className) {
            var component = new model.Component();
            component.id = utils.UUID.generate();
            this.components.push(component);
            return component.id;
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
        function Connection() {
        }
        return Connection;
    })();
    model.Connection = Connection;
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
/// <reference path='services/ComponentsResource.ts' />
/// <reference path='services/CodeResource.ts' />
/// <reference path='Application.ts' />
/// <reference path='_all.ts' />
'use strict';
var zirimiriEditor = angular.module('zirimiriEditor', ['ngResource']).controller('editorCtrl', controllers.EditorCtrl).service('componentsResource', services.ComponentsResource).service('codeResource', services.CodeResource);
