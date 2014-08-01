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
    }
}