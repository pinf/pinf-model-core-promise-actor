
var SYSTEM = require("primitives/system");
var NODE = require("primitives/node");
var FIRECONSOLE_WIDGET = require("fireconsole.widget.console");


exports.main = function () {

	console.log("Hello World from client.js");


	var widget = new FIRECONSOLE_WIDGET.Widget();


	var system = new SYSTEM.System();

	system.start().then(function () {

		return system.stop();

	}).then(function () {

		console.log("Done!");

	}).fail(function (err) {

		console.error(err.stack);

	});

}
