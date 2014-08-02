/// <reference path='../Topology.ts' />
/// <reference path='../Component.ts' />
/// <reference path='../Connection.ts' />

module model.translator
{
    'use strict';

    /**
     * The StormTranslator translates a topology
     * into its correspondent code in Storm
     * @author Andrés Sánchez
     */
    export class StormTranslator extends Translator
    {
        /**
         * Translate a topology into Storm
         * @param topology Topology to translate
         */
        public static translate(topology: model.Topology):string
        {
            var translation:string = "Storm\n------------------\n";
            var connections:Connection[] = topology.connections;
            var components:Component[] = topology.components;

            for (var i=0; i<connections.length; i++)
            {
                translation += "Connection\n------------------\n";
                translation += "Source => " + connections[i].source.id + "\n";
                translation += "Target => " + connections[i].target.id + "\n";
                translation += "------------------\n";
            }

            for (var i=0; i<components.length; i++)
            {
                translation += "Component\n------------------\n";
                translation += "Id => " + components[i].id + "\n";
                translation += "------------------\n";
            }

            return translation;
        }
    }
}
