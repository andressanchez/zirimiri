/// <reference path='../utils/UUID.ts' />

module model
{
    'use strict';

    /**
     * The Topology class represents a Storm topology, made of
     * components and connections between those components.
     * @author Andrés Sánchez
     */
    export class Topology
    {
        // Unique instance -> Singleton Pattern
        private static uniqueInstance : Topology;

        // Attributes
        private components: Component[];
        private connections: Connection[];

        /**
         * As only one topology can be modified at a time,
         * we get the same instance
         * @returns {Topology} Unique instance
         */
        public static getInstance() : Topology
        {
            if(this.uniqueInstance == null)
                this.uniqueInstance = new Topology();

            return this.uniqueInstance;
        }

        /**
         * Reset the topology and leave it empty
         */
        public resetTopology() : void
        {
            this.components = [];
            this.connections = [];
        }

        /**
         * Add a new component
         * @param className
         * @returns {string} UUID of the added component
         */
        public addComponent(className:string) : string
        {
            var component = new Component();
            component.id = utils.UUID.generate();
            this.components.push(component);
            return component.id;
        }
    }
}