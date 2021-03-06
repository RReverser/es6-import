(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports === 'object') {
        factory(exports);
    } else {
        factory(root);
    }
}(this, function (es6i_export) {
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
            },
            pull: function (es6i_export, source) {
                var module = es6i.modules[source]();
                for (var name in module) {
                    es6i_export[name] = module[name];
                }
            }
        };
    es6i.define('external/deep/dive', function (es6i_export) {
        '[content from external/deep/dive.js goes here]';
    });
    es6i.define('../out_of_matrix', function (es6i_export) {
        '[content from ../out_of_matrix.js goes here]';
    });
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
    es6i.define('external/world', function (es6i_export) {
        var answer = es6i.modules['external/deep/dive']().answer;
        var realWorldAnswer = es6i.modules['../out_of_matrix']().es6i_default;
        es6i_export.es6i_default = answer + realWorldAnswer;
        es6i.define('external/innerModule', function (es6i_export) {
        });
    });
    function scan(folder) {
        try {
            var h = open(folder);
        } finally {
            close(h);
        }
    }
    es6i_export.scan = scan;
    es6i.define('quickExamples', function (es6i_export) {
        var $ = es6i.modules['jquery']().es6i_default;
        var encrypt, decrypt;
        (function (es6i_import) {
            encrypt = es6i_import.encrypt;
            decrypt = es6i_import.decrypt;
        }(es6i.modules['crypto']()));
        var enc = es6i.modules['crypto']().encrypt;
        es6i.pull(es6i_export, 'crypto');
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
        function even(n) {
            return n == 0 || odd(n - 1);
        }
        es6i_export.even = es6i_default;
        var odd = es6i.modules['Odd']().es6i_default;
    });
    es6i.define('Odd', function (es6i_export) {
        function odd(n) {
            return n != 0 && even(n - 1);
        }
        es6i_export.odd = es6i_default;
        var even = es6i.modules['Even']().es6i_default;
    });
    es6i.define('SafeDOMWrapper', function (es6i_export) {
        var isWrapper = es6i_export.isWrapper = true;
        es6i.pull(es6i_export, 'SafeDOM');
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
        es6i.pull(es6i_export, 'SafeDOMWrapper');
    });
    var DOMMunger = es6i.modules['DOMMunger']();
    var SafeDOM = es6i.modules['SafeDOM']();
    var instance = DOMMunger.make(SafeDOM);
    es6i.define('counter', function (es6i_export) {
        function current() {
            return n;
        }
        es6i_export.current = current;
        function increment() {
            return n++;
        }
        es6i_export.increment = increment;
        var n = 0;
    });
    var open, close;
    (function (es6i_import) {
        open = es6i_import.open;
        close = es6i_import.close;
    }(es6i.modules['io/File']()));
    var lexer = es6i.modules['compiler/Lexer']();
    var shell = es6i.modules['shell']();
    var answer = es6i.modules['external/world']().es6i_default;
}));