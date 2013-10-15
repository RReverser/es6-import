var es6i = {
        modules: {},
        define: function (name, getter) {
            es6i.modules[name] = function () {
                var es6i_export = {};
                es6i.modules[name] = function () {
                    return es6i_export;
                };
                getter(es6i_export);
                return es6i_export;
            };
        }
    };
es6i.define('jquery', function (es6i_export) {
    '[content from jquery.js goes here]';
});
es6i.define('crypto', function (es6i_export) {
    '[content from crypto.js goes here]';
});
es6i.define('math', function (es6i_export) {
    '[content from math.js goes here]';
});
es6i.define('shape', function (es6i_export) {
    '[content from shape.js goes here]';
});
es6i.define('cowboy', function (es6i_export) {
    '[content from cowboy.js goes here]';
});
es6i.define('http://json.org/modules/json2.js', function (es6i_export) {
    '[content from http://json.org/modules/json2.js goes here]';
});
es6i.define('http://developer.yahoo.com/modules/yui3.js', function (es6i_export) {
    '[content from http://developer.yahoo.com/modules/yui3.js goes here]';
});
es6i.define('DOM', function (es6i_export) {
    '[content from DOM.js goes here]';
});
es6i.define('io/File', function (es6i_export) {
    '[content from io/File.js goes here]';
});
es6i.define('compiler/Lexer', function (es6i_export) {
    '[content from compiler/Lexer.js goes here]';
});
es6i.define('shell', function (es6i_export) {
    '[content from shell.js goes here]';
});
es6i.define('module', function (es6i_export) {
    '[content from module.js goes here]';
});
es6i.define('quickExamples', function (es6i_export) {
    var $ = es6i.modules['jquery']().es6i_default;
    var encrypt, decrypt;
    (function (es6i_import) {
        encrypt = es6i_import.encrypt;
        decrypt = es6i_import.decrypt;
    }(es6i.modules['crypto']()));
    var enc = es6i.modules['crypto']().encrypt;
    (function (es6i_import) {
        for (var name in es6i_import)
            es6i_export[name] = es6i_import[name];
    }(es6i.modules['crypto']()));
    (function (es6i_import) {
        es6i_export.foo = es6i_import.foo;
        es6i_export.barrrr = es6i_import.bar;
    }(es6i.modules['crypto']()));
});
var Math = es6i.modules['math']();
alert('2p = ' + Math.sum(Math.pi, Math.pi));
var drawShape = es6i.modules['shape']().draw;
var drawGun = es6i.modules['cowboy']().draw;
es6i.define('widgets', function (es6i_export) {
});
es6i.define('widgets/button', function (es6i_export) {
});
es6i.define('widgets/alert', function (es6i_export) {
});
es6i.define('widgets/textarea', function (es6i_export) {
});
var messageBox, confirmDialog;
(function (es6i_import) {
    messageBox = es6i_import.messageBox;
    confirmDialog = es6i_import.confirmDialog;
}(es6i.modules['widgets/alert']()));
var JSON = es6i.modules['http://json.org/modules/json2.js']();
alert(JSON.stringify({ 'hi': 'world' }));
var YUI = es6i.modules['http://developer.yahoo.com/modules/yui3.js']();
alert(YUI.dom.Color.toHex('blue'));
es6i.define('Even', function (es6i_export) {
    var odd = es6i.modules['Odd']().es6i_default;
    es6i_export.es6i_default = function even(n) {
        return n == 0 || odd(n - 1);
    };
});
es6i.define('Odd', function (es6i_export) {
    var even = es6i.modules['Even']().es6i_default;
    es6i_export.es6i_default = function odd(n) {
        return n != 0 && even(n - 1);
    };
});
es6i.define('SafeDOMWrapper', function (es6i_export) {
    var isWrapper = es6i_export.isWrapper = true;
    (function (es6i_import) {
        for (var name in es6i_import)
            es6i_export[name] = es6i_import[name];
    }(es6i.modules['SafeDOM']()));
});
es6i.define('DOMMunger', function (es6i_export) {
    function make(domAPI) {
        return {
            munge: function (doc) {
                domAPI.alert('hi!');
            }
        };
    }
    es6i_export.make = make;
});
es6i.define('SafeDOM', function (es6i_export) {
    var alert = es6i.modules['DOM']().alert;
    var document = es6i_export.document = {
            write: function (txt) {
                alert('I\'m sorry, Dave, I\'m afraid I can\'t do that...');
            }
        };
    (function (es6i_import) {
        for (var name in es6i_import)
            es6i_export[name] = es6i_import[name];
    }(es6i.modules['SafeDOMWrapper']()));
});
var DOMMunger = es6i.modules['DOMMunger']();
var SafeDOM = es6i.modules['SafeDOM']();
var instance = DOMMunger.make(SafeDOM);
es6i.define('counter', function (es6i_export) {
    var n = 0;
    function increment() {
        return n++;
    }
    es6i_export.increment = increment;
    function current() {
        return n;
    }
    es6i_export.current = current;
});
var open, close;
(function (es6i_import) {
    open = es6i_import.open;
    close = es6i_import.close;
}(es6i.modules['io/File']()));
var lexer = es6i.modules['compiler/Lexer']();
var shell = es6i.modules['shell']();
es6i.modules['module']();