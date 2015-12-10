'use strict'

// Define
class Cachely extends require('events').EventEmitter {
	static create (...args) {
		return new this(...args)
	}

	constructor (opts) {
		super()

		opts = opts || {}
		this.duration = opts.duration || require('oneday')
		this.log = opts.log || function () {}
		this.method = opts.method

		if ( typeof this.method !== 'function' ) {
			throw new Error('Cachely requires a method to be specified')
		}

		this.data = null
		this.retry = false
		this.lastRequest = null
		this.lastUpdate = null
	}

	// returns either 'valid', 'invalid', 'updating', or 'empty'
	validate () {
		const nowTime = (new Date()).getTime()

		// have we manually invalidated the cache?
		if ( this.retry ) {
			this.retry = false
			return 'invalid'
		}

		// have we fetched the data yet?
		else if ( this.lastUpdate ) {
			// yes we have, so let's check if it is still valid
			// if the current time, minus the cache duration, is than the last time we requested the data, then our cache is invalid
			return new Date(nowTime - this.duration) < this.lastRequest ? 'valid' : 'invalid'
		}

		// are we doing the first fetch?
		else if ( this.lastRequest ) {
			return 'updating'
		}

		// have we done no fetch yet?
		else {
			return 'empty'
		}
	}

	invalidate () {
		this.retry = true
		return this
	}

	// next(err, data)
	request (next) {
		const cache = this.validate()
		switch ( cache ) {
			case 'valid':
				this.log('debug', 'Cachely is returning cached data')
				next(null, this.data)
				break

			case 'invalid':
			case 'empty':
				this.log('debug', 'Cachely is fetching new data')
				this.lastRequest = new Date()
				this.once('update', next)
				this.method((err, data) => {
					if ( !err ) {
						this.data = data
					}
					this.lastUpdate = new Date()
					this.log('debug', 'Cachely has fetched the new data')
					this.emit('update', err, this.data)
				})
				break

			case 'updating':
				this.log('debug', 'Cachely is waiting for new data')
				this.once('update', next)
				break

			default:
				next(new Error('Unknown cache state'))
				break
		}
		return this
	}
}

// Export
module.exports = Cachely
