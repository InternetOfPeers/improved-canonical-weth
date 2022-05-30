/**
 * Convert number to BigNumber and clean the object for deep comparison
 */
toBN = function (number) {
	return cleanBN(web3.utils.toBN(number));
}

/**
 * 	Clean the object for deep comparison
 */
cleanBN = function (bignumber) {
	return bignumber.add(web3.utils.toBN(0));
}