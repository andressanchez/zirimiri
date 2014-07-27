module model
{
    'use strict';

    /**
     * List of available components for the editor
     * @author Andrés Sánchez
     */
    export class Components
    {
        private _json: any;
        private  _categories:Category[];
        private _componentById: { [id: string] : Component };

        /*
         * Create a new instance from a JSON object
         * @param srcJSON Definition of the list of components
         */
        constructor (srcJSON:any)
        {
            this._json = srcJSON;
            this._categories = <Category[]> srcJSON.categories;
        }

        /**
         * Get the list of components
         * @returns {Category[]} A list of components
         */
        public get categories():Category[]
        {
            return this._categories;
        }

        /**
         * Get a JSON definition of the list of components
         * @returns {any} Definition of the list of components
         */
        public get json():any
        {
            return this._json;
        }

        /**
         * Get a component by its id
         * @param id Identifier of the component
         * @returns {Component} Component with the given id
         */
        public getComponentById(id:string):Component
        {
            if (this._componentById == null)
            {
                this._componentById = {};
                this._categories.forEach(category =>
                {
                    category.components.forEach(component =>
                    {
                        this._componentById[component.id] = component;
                    });
                });
            }

            return this._componentById[id];
        }
    }
}
