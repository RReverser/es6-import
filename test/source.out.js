var es6i__modules = {};
function es6i__define(name, module) {
    es6i__modules[name] = function () {
        var exports = {};
        es6i__modules[name] = function () {
            return exports;
        };
        module(function (value, name) {
            if (arguments.length > 1) {
                if (typeof name === 'object') {
                    if (name === null) {
                        for (name in value) {
                            exports[name] = value[name];
                        }
                    } else {
                        var mappings = name;
                        for (name in mappings) {
                            exports[name] = value[mappings[name]];
                        }
                    }
                } else {
                    exports[name] = value;
                }
            } else {
                exports = value;
            }
        });
        return exports;
    };
}
es6i__define('quickExamples', function (export) {
    var $ = es6i__modules['jquery']();
    var encrypt = es6i__modules['crypto']().encrypt, decrypt = es6i__modules['crypto']().decrypt;
    var enc = es6i__modules['crypto']().encrypt;
    export(es6i__modules['crypto'](), null);
    export(es6i__modules['crypto'](), {
        'foo': 'foo',
        'barrrr': 'bar'
    });
});
var Math = es6i__modules['math'];
alert('2\u03c0 = ' + Math.sum(Math.pi, Math.pi));
var drawShape = es6i__modules['shape']().draw;
var drawGun = es6i__modules['cowboy']().draw;
es6i__define('widgets', function (export) {
});
es6i__define('widgets/button', function (export) {
});
es6i__define('widgets/alert', function (export) {
});
es6i__define('widgets/textarea', function (export) {
});
var messageBox = es6i__modules['widgets/alert']().messageBox, confirmDialog = es6i__modules['widgets/alert']().confirmDialog;
var JSON = es6i__modules['http://json.org/modules/json2.js'];
alert(JSON.stringify({ 'hi': 'world' }));
var YUI = es6i__modules['http://developer.yahoo.com/modules/yui3.js'];
alert(YUI.dom.Color.toHex('blue'));
es6i__define('Even', function (export) {
    var odd = es6i__modules['Odd']();
    export(function even(n) {
        return n == 0 || odd(n - 1);
    });
});
es6i__define('Odd', function (export) {
    var even = es6i__modules['Even']();
    export(function odd(n) {
        return n != 0 && even(n - 1);
    });
});
es6i__define('DOMMunger', function (export) {
    export(function make(domAPI) {
        return {
            munge: function (doc) {
                domAPI.alert('hi!');
            }
        };
    }, 'make');
});
es6i__define('SafeDOM', function (export) {
    var alert = es6i__modules['DOM']().alert;
    export({
        write: function (txt) {
            alert('I\'m sorry, Dave, I\'m afraid I can\'t do that...');
        }
    }, 'document');
});
var DOMMunger = es6i__modules['DOMMunger'];
var SafeDOM = es6i__modules['SafeDOM'];
var instance = DOMMunger.make(SafeDOM);
es6i__define('counter', function (export) {
    var n = 0;
    export(function increment() {
        return n++;
    }, 'increment');
    export(function current() {
        return n;
    }, 'current');
});
var open = es6i__modules['io/File']().open, close = es6i__modules['io/File']().close;
export(function scan(folder) {
    try {
        var h = open(folder);
    } finally {
        close(h);
    }
}, 'scan');
var lexer = es6i__modules['compiler/Lexer'];
var shell = es6i__modules['shell'];