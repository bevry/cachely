type Log = (logLevel: string, ...args: any[]) => any
type Retrieve<Result> = () => Promise<Result>
type Status = 'valid' | 'invalid' | 'updating' | 'empty'

interface CachelyOptions<Result> {
	/** the milliseconds that the cache should be valid for, defaults to one day */
	duration?: number
	/** method to send log output to */
	log?: Log
	/** the method that fetches the new source data, it should return a promise that resolves the result that will be cached */
	retrieve: Retrieve<Result>
}

export default class Cachely<Result> {
	duration: number
	log: Log
	retrieve: Retrieve<Result>
	data?: Result
	refresh: boolean = false
	lastRequested?: number
	lastRetrieval?: Promise<Result>
	lastUpdated: number | null = null

	/** Construct our Cachely class, setting the configuration from the options */
	constructor(opts: CachelyOptions<Result>) {
		if (!opts || typeof opts.retrieve !== 'function') {
			throw new Error(
				'Cachely requires a retrieve method to be specified that returns a promise'
			)
		}

		this.duration = opts.duration || require('oneday')
		this.log = opts.log || function() {}
		this.retrieve = opts.retrieve
	}

	/** Creates and returns new instance of the current class */
	static create<Result>(opts: CachelyOptions<Result>) {
		return new this(opts)
	}

	/** Determines whether or not the cache is still valid, by returning its current status */
	protected validate(): Status {
		const nowTime = new Date().getTime()

		// have we manually invalidated the cache?
		if (this.refresh) {
			this.refresh = false
			return 'invalid'
		}

		// have we fetched the data yet?
		else if (this.lastUpdated && this.lastRequested) {
			// yes we have, so let's check if it is still valid
			// if the current time, minus the cache duration, is than the last time we requested the data, then our cache is invalid
			return new Date(nowTime - this.duration).getTime() < this.lastRequested
				? 'valid'
				: 'invalid'
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

	/** Invalidates the current cache, so that it is retrieved again.
	Only applies to future resolution requets, does not cancel or modify active retrieval requests. */
	invalidate() {
		this.refresh = true
		return this
	}

	/** Resolve the cache, if it is valid use the cache's data, otherwise retrieve new data */
	async resolve(): Promise<Result> {
		const cache = this.validate()
		switch (cache) {
			case 'valid':
				this.log('debug', 'Cachely has resolved cached data')
				return this.data as Result

			case 'invalid':
			case 'empty':
				this.log('debug', 'Cachely must resolve new data')
				this.lastRequested = new Date().getTime()
				this.lastUpdated = null
				this.lastRetrieval = Promise.resolve(this.retrieve())
				try {
					this.data = await this.lastRetrieval
					this.lastUpdated = new Date().getTime()
				} catch (err) {
					this.log('debug', 'Cachely failed to resolve new data')
					return Promise.reject(err)
				}
				this.log('debug', 'Cachely has resolved the new data')
				return this.data as Result

			case 'updating':
				this.log('debug', 'Cachely is waiting for the new data to resolve')
				return this.lastRetrieval as Promise<Result>

			default:
				return Promise.reject(new Error('Unknown cache state'))
		}
	}
}
