/// <reference path='../_all.ts' />

module controllers
{
    'use strict';

    export interface IEditorScope extends ng.IScope
    {
        vm: EditorCtrl;
        code: string;
        components: model.Components;
        jsonComponents: any;
    }
}