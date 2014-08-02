/// <reference path='../_all.ts' />

module controllers
{
    'use strict';

    /**
     * The main controller for the app. The controller:
     * - retrieves and persists the model via the todoStorage service
     * - exposes the model to the template and provides event handlers
     */
    export class EditorCtrl
    {
        private topology;

        public static $inject = [
            '$scope',
            'componentsResource',
            'codeResource'
        ];

        /**
         *
         * @param $scope
         * @param componentsResource
         */
        constructor(
            private $scope: IEditorScope,
            private componentsResource: services.ComponentsResource,
            private codeResource: services.CodeResource)
        {

            $scope.vm = this;

            componentsResource.getComponents().then(function (result)
            {
                $scope.components = new model.Components(result);
                $scope.jsonComponents = $scope.components.json;
            });

            codeResource.getCode().then(function (result)
            {
               $scope.code = result.code;
            });

            model.Topology.getInstance().resetTopology();
            this.topology = model.Topology.getInstance();
        }

        /**
         * Create a new topology
         */
        public createTopology():void
        {
            model.Topology.getInstance().resetTopology();
            console.log("Created topology!");
        }

        /**
         *
         * @param targetFile
         * @returns {boolean}
         */
        public saveTopology(targetFile: string):boolean
        {
            return false;
        }

        /**
         *
         * @param sourceFile
         * @returns {boolean}
         */
        public loadTopology(sourceFile: string):boolean
        {
            return false;
        }

        /**
         * Add a new component to the topology
         * @param className Class of the new component
         * @returns {string} UUID of the new component
         */
        public addComponent(className: string):string
        {
            console.log(className);
            return model.Topology.getInstance().addComponent(className);
        }

        /**
         *
         * @param uuid
         * @returns {boolean}
         */
        public removeComponent(uuid: string):boolean
        {
            return false;
        }

        /**
         *
         * @param uuidSource
         * @param uuidTarget
         * @returns {boolean}
         */
        public addConnection(uuidSource: string, uuidTarget: string):boolean
        {
            return false;
        }

        /**
         *
         * @param uuidSource
         * @param uuidTarget
         * @returns {boolean}
         */
        public removeConnection(uuidSource: string, uuidTarget: string):boolean
        {
            return false;
        }

        /**
         *
         * @returns {string[]}
         */
        public topologyToCode():string[]
        {
            return null;
        }
    }
}