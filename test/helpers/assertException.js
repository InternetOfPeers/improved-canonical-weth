module.exports = function (error, message) {
	assert.isAbove(error.message.search("exited with an error"), -1, message);
}