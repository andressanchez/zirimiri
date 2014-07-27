/// <reference path='../_all.ts' />

module services
{
    'use strict';

    export class ComponentsResource
    {
        public static $inject = [
            '$resource'
        ];

        constructor(private $resource: ng.resource.IResourceService) { }

        getComponents():ng.IPromise<any>
        {
            return this.$resource('/zirimiri-ui/api/components.json').get().$get();
        }
    }
}