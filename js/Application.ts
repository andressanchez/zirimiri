/// <reference path='_all.ts' />

'use strict';

var zirimiriEditor = angular.module('zirimiriEditor', ['ngResource'])
    .controller('editorCtrl', controllers.EditorCtrl)
    .service('componentsResource', services.ComponentsResource)
    .service('codeResource', services.CodeResource);