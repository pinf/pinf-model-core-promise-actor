
var NODE = require("./node");


var System = exports.System = function () {

	this.onsignal(this, "primitives/start", function (source, message) {

console.log("trigger start", source, message);

		this.resolve();

		return this.promise;
	});

	this.onsignal(this, "primitives/stop", function (source, message) {

console.log("trigger stop", source, message);

		this.resolve();

		return this.promise;
	});

}

System.prototype = new NODE.Node();

System.prototype.start = function () {
	return this.signal(this, "primitives/start", {});
}

System.prototype.stop = function () {
	return this.signal(this, "primitives/stop", {});
}
