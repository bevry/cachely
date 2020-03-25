'use strict'

let fetches = 0
const cachely = require('./').default.create({
	// The method that will fetch the data
	retrieve() {
		return new Promise(function (resolve) {
			// after a one second delay, return the number of fetches that we have done
			setTimeout(() => resolve(++fetches), 1000)
		})
	},

	// An optional duration in milliseconds that our cache of the data will be valid for
	// When expired, on the next request of the data, we will use the method to get the latest data
	// Defaults to one day
	duration: 2000, // in this example we set it to two seconds

	// An optional function that receives debugging log messages
	// Defaults to nothing
	log: console.log,
})

// do an initial fetch of the dat
cachely
	.resolve()
	.catch(console.error)
	.then(
		console.log.bind(
			console,
			'after one second as specified in our method, the result data should still be 1:'
		)
	)

// do a subsequent fetch of the data that will be from the cach
cachely
	.resolve()
	.catch(console.error)
	.then(
		console.log.bind(
			console,
			'after a tiny delay this will be from cache, the result data should still be 1:'
		)
	)

// wait for the cache to invalidate itself
setTimeout(function () {
	// do an second fetch of the data
	cachely
		.resolve()
		.catch(console.error)
		.then(
			console.log.bind(
				console,
				'after one second as specified in our method, the result data should be 2, as it was our second fetch:'
			)
		)

	// do a subsequent fetch of the data that will be from the cache
	cachely
		.resolve()
		.catch(console.error)
		.then(
			console.log.bind(
				console,
				'after a tiny delay this will be from cache, the result data should still be 2:'
			)
		)

	// peform a manual invalidation
	cachely.invalidate()

	// do a third fetch of the data
	cachely
		.resolve()
		.catch(console.error)
		.then(
			console.log.bind(
				console,
				'after one second as specified in our method, the result data should be 3, as it was our third fetch:'
			)
		)

	// do a subsequent fetch of the data that will be from the cache
	cachely
		.resolve()
		.catch(console.error)
		.then(
			console.log.bind(
				console,
				'after a tiny delay this will be from cache, the result data should still be 3:'
			)
		)
}, 3000)
