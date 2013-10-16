module 'quickExamples' {
	import $ from "jquery";                    // import the default export of a module
	import { encrypt, decrypt } from "crypto"; // binding a module's exports to variables
	import { encrypt as enc } from "crypto";   // binding and renaming one of a module's exports
	export * from "crypto";                    // re-exporting another module's exports
	export { foo, bar as barrrr } from "crypto";         // re-exporting specified exports from another module
}

module Math from 'math';
 
// reify M as an immutable "module instance object"
alert("2p = " + Math.sum(Math.pi, Math.pi));

//=== Local renaming ===//

import { draw as drawShape } from 'shape';
import { draw as drawGun } from 'cowboy';

//=== Module name hierarchies ===//

module 'widgets' { }
module 'widgets/button' { }
module 'widgets/alert' { }
module 'widgets/textarea' { }
 
import { messageBox, confirmDialog } from 'widgets/alert';

//=== Remote modules on the web (1) ===//

// loading from a URL
module JSON from 'http://json.org/modules/json2.js';
 
alert(JSON.stringify({'hi': 'world'}));

//=== Remote modules on the web (2) ===//

// loading from a URL providing sub-modules
module YUI from 'http://developer.yahoo.com/modules/yui3.js';
 
alert(YUI.dom.Color.toHex("blue"));

//=== Cyclic dependencies ===//

// easy!
module 'Even' {
	import odd from 'Odd';
	export default function even(n) {
		return n == 0 || odd(n - 1);
	}
}

// woo-hoo!
module 'Odd' {
	import even from 'Even';
	export default function odd(n) {
		return n != 0 && even(n - 1);
	}
}

//=== Static analysis for import * from export * ===//

module 'SafeDOMWrapper' {
	export var isWrapper = true;
	export * from 'SafeDOM';
}

//=== Parameterization ===//

module 'DOMMunger' {
	// parameterized by a DOM implementation
	export function make(domAPI) {
		return {
			munge: function(doc) {
				domAPI.alert('hi!');
			}
		};
	}
}

module 'SafeDOM' {
	import { alert } from 'DOM';
 
	export var document = {
		write: function(txt) {
			alert('I\'m sorry, Dave, I\'m afraid I can\'t do that...')
		}
	};

	export * from 'SafeDOMWrapper';
}
module DOMMunger from 'DOMMunger';
module SafeDOM from 'SafeDOM';
var instance = DOMMunger.make(SafeDOM);

//=== Shared state ===//

module 'counter' {
	var n = 0;
	export function increment() { return n++ }
	export function current() { return n }
}

import { open, close } from 'io/File';
export function scan(folder) {
	try {
		var h = open(folder)
	} finally { close(h) }
}

module lexer from 'compiler/Lexer';
module shell from 'shell';

import answer from 'external/world';

