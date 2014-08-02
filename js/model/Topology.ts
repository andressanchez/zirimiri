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
        private _components: Component[];
        private _connections: Connection[];

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
         * Get the components in the topology
         * @returns {Component[]} Components in the topology
         */
        get components():Component[]
        {
            return this._components;
        }

        /**
         * Get the connections in the topology
         * @returns {Connection[]} Connections in the topology
         */
        get connections():Connection[]
        {
            return this._connections;
        }

        /**
         * Reset the topology and leave it empty
         */
        public resetTopology() : void
        {
            this._components = [];
            this._connections = [];
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
            this._components.push(component);
            return component.id;
        }

        /**
         * Remove a component
         * @param uuid UUID of the component to remove
         * @returns {boolean} True if it was removed, false otherwise
         */
        public removeComponent(uuid:string):boolean
        {
            var index:number = -1;

            for (var i=0; i<this._components.length; i++)
                if (this._components[i].id == uuid) {
                    index = i;
                    break;
                }

            if (index == -1) return false;

            this._components.splice(index, 1);
            return true;
        }

        /**
         * Add a new connection between components
         * @param uuidSource UUID of the source component
         * @param uuidTarget UUID of the target component
         * @returns {boolean} True if the connection has been establish, false otherwise
         */
        public addConnection(uuidSource: string, uuidTarget: string):boolean
        {
            var source:Component = null;
            var target:Component = null;

            for (var i=0; i<this._components.length; i++)
            {
                if (this._components[i].id == uuidSource) source = this._components[i];
                if (this._components[i].id == uuidTarget) target = this._components[i];
            }

            if (source == null || target == null) return false;

            var connection = new Connection(source, target);
            this._connections.push(connection);
            return true;
        }

        /**
         * Remove an existent connection between components
         * @param uuidSource UUID of the source component
         * @param uuidTarget UUID of the target component
         * @returns {boolean} True if the connection has been remove, false otherwise
         */
        public removeConnection(uuidSource: string, uuidTarget: string):boolean
        {
            var index:number = -1;

            for (var i=0; i<this._connections.length; i++)
            {
                if (this._connections[i].source.id == uuidSource && this._connections[i].target.id == uuidTarget)
                {
                    index = i;
                    break;
                }
            }

            if (index == -1) return false;

            this._connections.splice(index, 1);
            return true;
        }
    }
}