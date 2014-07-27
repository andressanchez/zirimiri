/// <reference path='../_all.ts' />

module services
{
    'use strict';

    export class CodeResource
    {
        public static $inject = [
            '$resource'
        ];

        constructor(private $resource: ng.resource.IResourceService) { }

        getCode():ng.IPromise<any>
        {
            return this.$resource('api/code.json').get().$get();
        }
    }
}