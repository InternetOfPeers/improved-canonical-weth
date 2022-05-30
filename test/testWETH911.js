'use strict'

const WETH911 = artifacts.require("WETH911");
const assertException = require('./helpers/assertException');
require('./helpers/utils.js');

contract("WETH911", function (accounts) {

	const AMOUNT = 10;
	const AMOUNT_BN = toBN(AMOUNT);
	const USER_A = accounts[0];
	const USER_B = accounts[1];

	let contract;

	before("Init WETH911", async () => {
		WETH911.deployed().then(function (instance) {
			contract = instance;
		});
	});

	it("should start without tokens", async () => {
		const balance = cleanBN(await contract.balanceOf(USER_A));
		const expectedBalance = toBN(0);
		expect(balance).to.eql(expectedBalance);
	});

	it("should not be able to send WETH911 tokens", async () => {
		try {
			await contract.transfer(USER_B, AMOUNT, {
				from: USER_A
			})
			assert.fail('UserA has no WEH911 tokens');
		} catch (error) {
			assertException(error);
		}
	})

	it("should mint tokens", async () => {
		await contract.send(AMOUNT, {
			from: USER_A
		});
		const balance = cleanBN(await contract.balanceOf(USER_A));
		expect(balance).to.eql(AMOUNT_BN);
	});

	it("should not allow the contract to receive WETH911", async () => {
		try {

			await contract.transfer(contract.address, AMOUNT, {
				from: USER_A
			})
			assert.fail('Contract cannot receive WETH911 tokens');
		} catch (error) {
			assertException(error);
		}
	})

	it("should transfer tokens", async () => {
		let initialBalanceUserA = cleanBN(await contract.balanceOf(USER_A));
		let initialBalanceUserB = cleanBN(await contract.balanceOf(USER_B));

		await contract.transfer(USER_B, AMOUNT, {
			from: USER_A
		});

		let newBalanceUserA = cleanBN(await contract.balanceOf(USER_A));
		let newBalanceUserB = cleanBN(await contract.balanceOf(USER_B));

		let expectedNewBalanceUserA = initialBalanceUserA.sub(AMOUNT_BN);
		let expectedNewBalanceUserB = initialBalanceUserB.add(AMOUNT_BN);

		expect(newBalanceUserA).to.eql(expectedNewBalanceUserA);
		expect(newBalanceUserB).to.eql(expectedNewBalanceUserB);
	});

	it("should burn tokens and get ethers back", async () => {
		let initialEtherBalance = toBN(await web3.eth.getBalance(USER_B));
		let initialBalance = cleanBN(await contract.balanceOf(USER_B));

		let tx = await contract.withdraw(AMOUNT, {
			from: USER_B
		});

		let txCost = toBN(tx.receipt.effectiveGasPrice * tx.receipt.gasUsed);
		let newEtherBalance = toBN(await web3.eth.getBalance(USER_B));
		let newBalance = cleanBN(await contract.balanceOf(USER_B));

		let expectedEtherBalance = initialEtherBalance.sub(txCost).add(AMOUNT_BN);
		let expectedBalance = initialBalance.sub(AMOUNT_BN);

		expect(newEtherBalance).to.eql(expectedEtherBalance);
		expect(newBalance).to.eql(expectedBalance);
	});

});