/// <reference path='../_all.ts' />

module model
{
    'use strict';

    export class Connection
    {
        constructor(private _source:Component, private _target:Component) {}

        /**
         * Get the source component of this connection
         * @returns {Component} Source component
         */
        get source():Component {
            return this._source;
        }

        /**
         * Get the target component of this connection
         * @returns {Component} Target component
         */
        get target():Component {
            return this._target;
        }
    }
}