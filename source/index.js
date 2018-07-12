'use strict'

/**
Construct our Cachely class, setting the configuration from the options
@param {Object} opts
@param {Number} opts.duration - the milliseconds that the cache should be valid for, defaults to one day
@param {Function} [opts.log] - defaults to `null`, can be a function that receives the arguments: `logLevel`, `...args`
@param {Function} [opts.retrieve] - the method that fetches the new source data, it should return a promise that resolves the result that will be cached
@public
*/
class Cachely {
	constructor (opts = {}) {
		this.duration = opts.duration || require('oneday')
		this.log = opts.log || function () { }
		this.retrieve = opts.retrieve

		if (typeof this.retrieve !== 'function') {
			throw new Error('Cachely requires a retrieve method to be specified that returns a promise')
		}

		// Private properties
		this.data = null
		this.refresh = false
		this.lastRequested = null
		this.lastRetrieval = null
		this.lastUpdated = null
	}

	/**
	Creates and returns new instance of the current class
	@param {...*} args - the arguments to be forwarded along to the constructor
	@return {Object} The new instance.
	@static
	@public
	*/
	static create (...args) {
		return new this(...args)
	}

	/**
	Determines whether or not the cache is still valid, by returning its current status
	@returns {string} - 'valid', 'invalid', 'updating', or 'empty'
	@private
	*/
	validate () {
		const nowTime = (new Date()).getTime()

		// have we manually invalidated the cache?
		if (this.refresh) {
			this.refresh = false
			return 'invalid'
		}

		// have we fetched the data yet?
		else if (this.lastUpdated) {
			// yes we have, so let's check if it is still valid
			// if the current time, minus the cache duration, is than the last time we retrieved the data, then our cache is invalid
			return new Date(nowTime - this.duration) < this.lastRequested ? 'valid' : 'invalid'
		}

		// are we doing the first fetch?
		else if (this.lastRequested) {
			return 'updating'
		}

		// have we done no fetch yet?
		else {
			return 'empty'
		}
	}

	/**
	Invalidates the current cache, so that it is retrieved again.
	Only applies to future resolution requets, does not cancel or modify active retrieval requests.
	@returns {this}
	@chainable
	@public
	*/
	invalidate () {
		this.refresh = true
		return this
	}

	/**
	Resolve the cache, if it is valid use the cache's data, otherwise retrieve new data
	@returns {Promise<*>}
	@public
	*/
	async resolve () {
		const cache = this.validate()
		switch (cache) {
			case 'valid':
				this.log('debug', 'Cachely has resolved cached data')
				return this.data

			case 'invalid':
			case 'empty':
				this.log('debug', 'Cachely must resolve new data')
				this.lastRequested = new Date()
				this.lastUpdated = null
				this.lastRetrieval = Promise.resolve(this.retrieve())
				try {
					this.data = await this.lastRetrieval
					this.lastUpdated = new Date()
				}
				catch (err) {
					this.log('debug', 'Cachely failed to resolve new data')
					return Promise.reject(err)
				}
				this.log('debug', 'Cachely has resolved the new data')
				return this.data

			case 'updating':
				this.log('debug', 'Cachely is waiting for the new data to resolve')
				return this.lastRetrieval

			default:
				return Promise.reject(new Error('Unknown cache state'))
		}
	}
}

// Export
module.exports = Cachely
