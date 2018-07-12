/* eslint no-console:0 */
'use strict'

// Import
const joe = require('joe')
const { equal, errorEqual } = require('assert-helpers')
const typeChecker = require('typechecker')
const Cachely = require('../')
const oneSecond = 1000
const twoSeconds = oneSecond * 2
const threeSeconds = oneSecond * 3
const fourSeconds = oneSecond * 4
const tenSeconds = oneSecond * 10

// Task
joe.describe('cachely', function (describe) {
	let cachely, fetches = 0

	describe('setup', function (describe, it) {
		it('should fail to instantiate with incorrect setup', function () {
			let err = null
			try {
				cachely = new Cachely()
			}
			catch (_err) {
				err = _err
			}
			errorEqual(err, 'Cachely requires a retrieve method to be specified')
		})

		it('should instantiate successfully with correct setup', function () {
			cachely = Cachely.create({
				retrieve () {
					return new Promise(function (resolve) {
						setTimeout(() => resolve(++fetches), twoSeconds)
					})
				},
				duration: tenSeconds,
				log: console.log
			})
		})
	})

	describe('fetch', function (describe, it) {
		let lastRequested, lastUpdated = null

		it('should fetch the data successfully', function (next) {
			let result = null, checks = 0
			cachely.resolve().catch(next).then(function (data) {
				result = data
				equal(data, 1, 'data from cachely was as expected for the first fetching')
				equal(++checks, 2, 'checks value was as expected')
			})
			setTimeout(function () {
				lastRequested = cachely.lastRequested
				equal(typeChecker.getType(cachely.lastRequested), 'date', 'last requested should exist, as the request has been made')
				equal(cachely.lastUpdated, null, 'last updated should be empty, as it should take a while')
				equal(result, null, 'data has not been fetched yet as it should have taken longer')
				equal(++checks, 1, 'checks value was as expected')
			}, oneSecond)
			setTimeout(function () {
				lastUpdated = cachely.lastUpdated
				equal(typeChecker.getType(cachely.lastUpdated), 'date', 'updated should exist, as the data should now be resolved')
				equal(result, 1, 'data should have been received after a while')
				equal(++checks, 3, 'checks value was as expected')
			}, threeSeconds)
			setTimeout(function () {
				equal(checks, 3, 'all checks for this test occured')
				next()
			}, fourSeconds)
		})

		it('should fetch the data from cache successfully', function (next) {
			let result = null, checks = 0
			cachely.resolve().catch(next).then(function (data) {
				result = data
				equal(cachely.lastRequested, lastRequested, 'last requested should be the same, as the cache was used')
				equal(cachely.lastUpdated, lastUpdated, 'last updated should be the same, as the cache was used')
				equal(data, 1, 'data from cachely was as expected for the cached result of the first fetch')
				equal(++checks, 1, 'checks value was as expected')
			})
			setTimeout(function () {
				equal(cachely.lastRequested, lastRequested, 'last requested should be the same, as the cache was used')
				equal(cachely.lastUpdated, lastUpdated, 'last updated should be the same, as the cache was used')
				equal(result, 1, 'data should have been received quickly as we got it from the cache')
				equal(++checks, 2, 'checks value was as expected')
			}, oneSecond)
			setTimeout(function () {
				equal(checks, 2, 'all checks for this test occured')
				next()
			}, twoSeconds)
		})

		it('should invalidate the cache after the duration successfully', function (next) {
			setTimeout(function () {
				let result = null, checks = 0
				cachely.resolve().catch(next).then(function (data) {
					result = data
					equal(data, 2, 'data from cachely was as expected for the second fetching')
					equal(++checks, 2, 'checks value was as expected')
				})
				setTimeout(function () {
					equal(result, null, 'data has not been fetched yet as it should have taken longer')
					equal(++checks, 1, 'checks value was as expected')
				}, oneSecond)
				setTimeout(function () {
					equal(result, 2, 'data should have been received after a while')
					equal(++checks, 3, 'checks value was as expected')
				}, threeSeconds)
				setTimeout(function () {
					equal(checks, 3, 'all checks for this test occured')
					next()
				}, fourSeconds)
			}, tenSeconds)
		})

		it('should invalidate the cache after the manual invalidation', function (next) {
			let result = null, checks = 0
			cachely.invalidate().resolve().catch(next).then(function (data) {
				result = data
				equal(data, 3, 'data from cachely was as expected for the third fetching')
				equal(++checks, 2, 'checks value was as expected')
			})
			setTimeout(function () {
				equal(result, null, 'data has not been fetched yet as it should have taken longer')
				equal(++checks, 1, 'checks value was as expected')
			}, oneSecond)
			setTimeout(function () {
				equal(result, 3, 'data should have been received after a while')
				equal(++checks, 3, 'checks value was as expected')
			}, threeSeconds)
			setTimeout(function () {
				equal(checks, 3, 'all checks for this test occured')
				next()
			}, fourSeconds)
		})

		it('should fetch the data from cache successfully after manual invalidation', function (next) {
			let result = null, checks = 0
			cachely.resolve().catch(next).then(function (data) {
				result = data
				equal(data, 3, 'data from cachely was as expected for the cached result of the first fetch')
				equal(++checks, 1, 'checks value was as expected')
			})
			setTimeout(function () {
				equal(result, 3, 'data should have been received quickly as we got it from the cache')
				equal(++checks, 2, 'checks value was as expected')
			}, oneSecond)
			setTimeout(function () {
				equal(checks, 2, 'all checks for this test occured')
				next()
			}, twoSeconds)
		})
	})
})
