module utils
{
    'use strict';

    export class UUID
    {
        public static generate():string
        {
            return UUID.s4() + UUID.s4() + '-' + UUID.s4() + '-' + UUID.s4() + '-' +
                        UUID.s4() + '-' + UUID.s4() + UUID.s4() + UUID.s4();
        }

        private static s4():string
        {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
    }
}