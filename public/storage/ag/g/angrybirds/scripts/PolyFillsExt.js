// *********************************
// CoolGames Builder JavaScript file
// *********************************

(function(){
    if(Math.sign === undefined){
        Math.sign = Math.sign || function(x) {
                x = +x; // convert to a number
                if (x === 0 || isNaN(x)) {
                    return Number(x);
                }
                return x > 0 ? 1 : -1;
            };
    }

    if (!String.format) 
    {
        String.format = function(format) 
        {
            var args = Array.prototype.slice.call(arguments, 1);

            return format.replace(/{(\d+)}/g, function(match, number) 
            { 
                return typeof args[number] != 'undefined' ? args[number] : match;
            });
        };
    }

    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function(searchString, position){
            return this.substr(position || 0, searchString.length) === searchString;
        };
    }

    if (!Array.prototype.find) 
    {
        Array.prototype.find = function(predicate) {
            if (this === null) 
            {
                throw new TypeError('Array.prototype.find called on null or undefined');
            }
            if (typeof predicate !== 'function') 
            {
                throw new TypeError('predicate must be a function');
            }
            var list = Object(this);
            var length = list.length >>> 0;
            var thisArg = arguments[1];
            var value;

            for (var i = 0; i < length; i++) 
            {
                value = list[i];
                if (predicate.call(thisArg, value, i, list)) 
                {
                    return value;
                }
            }
            return undefined;
        };
    }   

    //implementation by MDN.
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex?v=example#Polyfill
    if (!Array.prototype.findIndex) {
        Array.prototype.findIndex = function(predicate) {
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }

            var o = Object(this);
            var len = o.length >>> 0;

            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }

            var thisArg = arguments[1];
            var k = 0;

            while (k < len) {
                var kValue = o[k];
                if (predicate.call(thisArg, kValue, k, o)) {
                return k;
                }
                k++;
            }

            return -1;
        };
    }
}());

