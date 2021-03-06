/**
 * @fileoverview Tests for lib/utils/node-event-generator.js
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var should = require ('should');
var EventGenerator = require ('../../../lib/utils/node-event-generator'),
	Solium = require ('../../../lib/solium');

describe ('Testing EventGenerator instance for exposed functionality', function () {

	it ('should create a new instance of EventGenerator and expose a set of functions', function (done) {
		var generator = new EventGenerator (Solium);

		generator.should.be.type ('object');
		generator.should.be.instanceof (EventGenerator);

		generator.should.have.ownProperty ('emitter', Solium);

		generator.should.have.property ('enterNode');
		generator.enterNode.should.be.type ('function');

		generator.should.have.property ('leaveNode');
		generator.leaveNode.should.be.type ('function');

		done ();
	});

	it ('should behave as expected upon calling enterNode ()', function (done) {
		var successCountDown = 2;
		var generator = new EventGenerator (Solium);

		Solium.on ('TestNodeEnter', function (emitted) {
			emitted.should.have.ownProperty ('node');
			emitted.node.should.have.ownProperty ('type', 'TestNodeEnter');
			emitted.should.have.ownProperty ('exit', false);

			successCountDown--;
			!successCountDown && (Solium.reset () || done ());
		});

		Solium.on ('TestNodeLeave', function (emitted) {
			emitted.should.have.ownProperty ('node');
			emitted.node.should.have.ownProperty ('type', 'TestNodeLeave');
			emitted.should.have.ownProperty ('exit', true);

			successCountDown--;
			!successCountDown && (Solium.reset () || done ());
		});

		generator.enterNode ({ type: 'TestNodeEnter' });
		generator.leaveNode ({ type: 'TestNodeLeave' });
	});

});