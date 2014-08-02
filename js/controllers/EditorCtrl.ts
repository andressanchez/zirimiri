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
        private topology:model.Topology;
        private translatorType:string;

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
            return model.Topology.getInstance().addComponent(className);
        }

        /**
         * Remove a given component
         * @param uuid UUID of the component to remove
         * @returns {boolean} True if it was removed, false otherwise
         */
        public removeComponent(uuid: string):boolean
        {
            return model.Topology.getInstance().removeComponent(uuid);
        }

        /**
         * Add a new connection between components
         * @param uuidSource UUID of the source component
         * @param uuidTarget UUID of the target component
         * @returns {boolean} True if the connection has been establish, false otherwise
         */
        public addConnection(uuidSource: string, uuidTarget: string):boolean
        {
            return model.Topology.getInstance().addConnection(uuidSource, uuidTarget);
        }

        /**
         * Remove an existent connection between components
         * @param uuidSource UUID of the source component
         * @param uuidTarget UUID of the target component
         * @returns {boolean} True if the connection has been remove, false otherwise
         */
        public removeConnection(uuidSource: string, uuidTarget: string):boolean
        {
            return model.Topology.getInstance().removeConnection(uuidSource, uuidTarget);
        }

        /**
         *
         * @returns {string[]}
         */
        public topologyToCode():string[]
        {
            var translation:string[] = [];

            if (this.translatorType == "trident")
                translation.push(model.translator.TridentTranslator.translate(model.Topology.getInstance()));
            else if (this.translatorType == "marceline")
                translation.push(model.translator.MarcelineTranslator.translate(model.Topology.getInstance()));
            else
                translation.push(model.translator.StormTranslator.translate(model.Topology.getInstance()));

            return translation;
        }

        /**
         *
         * @param type
         */
        public changeTranslator(type:string):void
        {
            this.translatorType = type;
        }
    }
}