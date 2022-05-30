const WETH911 = artifacts.require("WETH911");

module.exports = function (deployer) {
	deployer.deploy(WETH911);
};