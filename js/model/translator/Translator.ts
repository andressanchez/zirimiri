/// <reference path='../Topology.ts' />

module model.translator
{
    'use strict';

    /**
     * The Translator interface must be implemented by
     * every translator from graphical view to code
     * @author Andrés Sánchez
     */
    export class Translator
    {
        /**
         * Translate a topology
         * @param topology Topology to translate
         */
        public static translate(topology: model.Topology):string { return ""; }
    }
}