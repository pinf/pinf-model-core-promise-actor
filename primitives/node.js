
var Q = require("q");


var Node = exports.Node = function () {

	console.log("init node");

	this.onsignal_listeners = [];

}

Node.prototype.onsignal = function (source, schema, listener) {
	this.onsignal_listeners.push([
		source,
		schema,
		listener
	]);
}

Node.prototype.signal = function (source, schema, message) {
	var self = this;

	console.log("forward signal", source, schema, message);

	var done = Q.resolve();
	try {
		this.onsignal_listeners.filter(function (listener) {
			return (
				listener[0] === self &&
				listener[1] === schema
			);
		}).forEach(function (listener) {
			return done = Q.when(done, function () {

				var deferred = Q.defer();

				var promise = listener[2].call(deferred, source, message);

				if (!Q.isPromise(promise)) {
					throw new Error("Listener for schema '" + schema + "' did not return promise!");
				}

				return promise;				 
			});
		});
	} catch (err) {
		done = Q.reject(err);
	}
	return done;
}
