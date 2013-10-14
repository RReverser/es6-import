var Math = __somehow_load__('math');
alert('2\u03c0 = ' + Math.sum(Math.pi, Math.pi));
var drawShape = shape().draw;
var drawGun = cowboy().draw;
function widgets() {
}
function widgets/button() {
}
function widgets/alert() {
}
function widgets/textarea() {
}
{
    var messageBox, confirmDialog;
    (function (es6i__import) {
        messageBox = es6i__import.messageBox;
        confirmDialog = es6i__import.confirmDialog;
    }(widgets/alert()));
}
var JSON = __somehow_load__('http://json.org/modules/json2.js');
alert(JSON.stringify({ 'hi': 'world' }));
var YUI = __somehow_load__('http://developer.yahoo.com/modules/yui3.js');
alert(YUI.dom.Color.toHex('blue'));
function Even() {
    var es6i__export = {};
    var odd = Odd();
    es6i__export.even = function even(n) {
        return n == 0 || odd(n - 1);
    };
    return es6i__export;
}
function Odd() {
    var es6i__export = {};
    var even = Even();
    es6i__export.odd = function odd(n) {
        return n != 0 && even(n - 1);
    };
    return es6i__export;
}
function DOMMunger() {
    var es6i__export = {};
    es6i__export.make = function make(domAPI) {
        return {
            munge: function (doc) {
                domAPI.alert('hi!');
            }
        };
    };
    return es6i__export;
}
function SafeDOM() {
    var es6i__export = {};
    var alert = DOM().alert;
    es6i__export.document = {
        write: function (txt) {
            alert('I\'m sorry, Dave, I\'m afraid I can\'t do that...');
        }
    };
    return es6i__export;
}
var DOMMunger = __somehow_load__('DOMMunger');
var SafeDOM = __somehow_load__('SafeDOM');
var instance = DOMMunger.make(SafeDOM);
function counter() {
    var es6i__export = {};
    var n = 0;
    es6i__export.increment = function increment() {
        return n++;
    };
    es6i__export.current = function current() {
        return n;
    };
    return es6i__export;
}
{
    var open, close;
    (function (es6i__import) {
        open = es6i__import.open;
        close = es6i__import.close;
    }(io/File()));
}
es6i__export.scan = function scan(folder) {
    try {
        var h = open(folder);
    } finally {
        close(h);
    }
};
var lexer = __somehow_load__('compiler/Lexer');
var shell = __somehow_load__('shell');