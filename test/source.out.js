var es6i__modules = {};
es6i__modules['Math'] = function () {
    var es6i__export = {};
    es6i__modules['Math'] = function () {
        return es6i__export;
    };
    '[content from math goes here]';
    return es6i__export;
};
alert('2\u03c0 = ' + Math.sum(Math.pi, Math.pi));
var drawShape = es6i__modules['shape']().draw;
var drawGun = es6i__modules['cowboy']().draw;
es6i__modules['widgets'] = function () {
};
es6i__modules['widgets/button'] = function () {
};
es6i__modules['widgets/alert'] = function () {
};
es6i__modules['widgets/textarea'] = function () {
};
var messageBox = es6i__modules['widgets/alert']().messageBox, confirmDialog = es6i__modules['widgets/alert']().confirmDialog;
es6i__modules['JSON'] = function () {
    var es6i__export = {};
    es6i__modules['JSON'] = function () {
        return es6i__export;
    };
    '[content from http://json.org/modules/json2.js goes here]';
    return es6i__export;
};
alert(JSON.stringify({ 'hi': 'world' }));
es6i__modules['YUI'] = function () {
    var es6i__export = {};
    es6i__modules['YUI'] = function () {
        return es6i__export;
    };
    '[content from http://developer.yahoo.com/modules/yui3.js goes here]';
    return es6i__export;
};
alert(YUI.dom.Color.toHex('blue'));
es6i__modules['Even'] = function () {
    var es6i__export = {};
    es6i__modules['Even'] = function () {
        return es6i__export;
    };
    var odd = es6i__modules['Odd']();
    es6i__export = function even(n) {
        return n == 0 || odd(n - 1);
    };
    return es6i__export;
};
es6i__modules['Odd'] = function () {
    var es6i__export = {};
    es6i__modules['Odd'] = function () {
        return es6i__export;
    };
    var even = es6i__modules['Even']();
    es6i__export = function odd(n) {
        return n != 0 && even(n - 1);
    };
    return es6i__export;
};
es6i__modules['DOMMunger'] = function () {
    var es6i__export = {};
    es6i__modules['DOMMunger'] = function () {
        return es6i__export;
    };
    es6i__export.make = function make(domAPI) {
        return {
            munge: function (doc) {
                domAPI.alert('hi!');
            }
        };
    };
    return es6i__export;
};
es6i__modules['SafeDOM'] = function () {
    var es6i__export = {};
    es6i__modules['SafeDOM'] = function () {
        return es6i__export;
    };
    var alert = es6i__modules['DOM']().alert;
    es6i__export.document = {
        write: function (txt) {
            alert('I\'m sorry, Dave, I\'m afraid I can\'t do that...');
        }
    };
    return es6i__export;
};
es6i__modules['DOMMunger'] = function () {
    var es6i__export = {};
    es6i__modules['DOMMunger'] = function () {
        return es6i__export;
    };
    '[content from DOMMunger goes here]';
    return es6i__export;
};
es6i__modules['SafeDOM'] = function () {
    var es6i__export = {};
    es6i__modules['SafeDOM'] = function () {
        return es6i__export;
    };
    '[content from SafeDOM goes here]';
    return es6i__export;
};
var instance = DOMMunger.make(SafeDOM);
es6i__modules['counter'] = function () {
    var es6i__export = {};
    es6i__modules['counter'] = function () {
        return es6i__export;
    };
    var n = 0;
    es6i__export.increment = function increment() {
        return n++;
    };
    es6i__export.current = function current() {
        return n;
    };
    return es6i__export;
};
var open = es6i__modules['io/File']().open, close = es6i__modules['io/File']().close;
es6i__export.scan = function scan(folder) {
    try {
        var h = open(folder);
    } finally {
        close(h);
    }
};
es6i__modules['lexer'] = function () {
    var es6i__export = {};
    es6i__modules['lexer'] = function () {
        return es6i__export;
    };
    '[content from compiler/Lexer goes here]';
    return es6i__export;
};
es6i__modules['shell'] = function () {
    var es6i__export = {};
    es6i__modules['shell'] = function () {
        return es6i__export;
    };
    '[content from shell goes here]';
    return es6i__export;
};