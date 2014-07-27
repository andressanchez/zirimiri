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
        }
    }
}