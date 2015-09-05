
<!-- TITLE/ -->

# cachely

<!-- /TITLE -->


<!-- BADGES/ -->

[![Build Status](https://img.shields.io/travis/bevry/cachely/master.svg)](http://travis-ci.org/bevry/cachely "Check this project's build status on TravisCI")
[![NPM version](https://img.shields.io/npm/v/cachely.svg)](https://npmjs.org/package/cachely "View this project on NPM")
[![NPM downloads](https://img.shields.io/npm/dm/cachely.svg)](https://npmjs.org/package/cachely "View this project on NPM")
[![Dependency Status](https://img.shields.io/david/bevry/cachely.svg)](https://david-dm.org/bevry/cachely)
[![Dev Dependency Status](https://img.shields.io/david/dev/bevry/cachely.svg)](https://david-dm.org/bevry/cachely#info=devDependencies)<br/>
[![Gratipay donate button](https://img.shields.io/gratipay/bevry.svg)](https://www.gratipay.com/bevry/ "Donate weekly to this project using Gratipay")
[![Flattr donate button](https://img.shields.io/badge/flattr-donate-yellow.svg)](http://flattr.com/thing/344188/balupton-on-Flattr "Donate monthly to this project using Flattr")
[![PayPayl donate button](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QB8GQPZAH84N6 "Donate once-off to this project using Paypal")
[![BitCoin donate button](https://img.shields.io/badge/bitcoin-donate-yellow.svg)](https://bevry.me/bitcoin "Donate once-off to this project using BitCoin")
[![Wishlist browse button](https://img.shields.io/badge/wishlist-donate-yellow.svg)](https://bevry.me/wishlist "Buy an item on our wishlist for us")

<!-- /BADGES -->


<!-- DESCRIPTION/ -->

A tiny wrapper that sits around your request function that caches its data for a specified duration, provides updates as requested rather than polling each interval

<!-- /DESCRIPTION -->


<!-- INSTALL/ -->

## Install

### [NPM](http://npmjs.org/)
- Use: `require('cachely')`
- Install: `npm install --save cachely`

### [Browserify](http://browserify.org/)
- Use: `require('cachely')`
- Install: `npm install --save cachely`
- CDN URL: `//wzrd.in/bundle/cachely@1.0.0`

### [Ender](http://enderjs.com)
- Use: `require('cachely')`
- Install: `ender add cachely`

<!-- /INSTALL -->


## Usage

``` javascript
let fetches = 0
const cachely = require('cachely').create({
	// The method that will fetch the data
	// It receives one argument which is a completion callback that accepts two arguments (err and data)
	method: function (next) {
		// in this case, after a one second delay, return the number of fetches that we have done
		setTimeout(function () {
			next(null, ++fetches)  // err, data
		}, 1000)
	},

	// An optional duration in milliseconds that our cache of the data will be valid for
	// When expired, on the next request of the data, we will use the method to get the latest data
	// Defaults to one day
	duration: 2000,  // in this example we set it to two seconds

	// An optional function that receives debugging log messages
	// Defaults to nothing
	log: console.log
})

// do an initial fetch of the data
cachely.request(function (err, data) {
	console.log('after one second as specified in our method, the result data should still be 1:', data, err)
})

// do a subsequent fetch of the data that will be from the cache
cachely.request(function (err, data) {
	console.log('after a tiny delay this will be from cache, the result data should still be 1:', data, err)
})

// wait for the cache to invalidate itself
setTimeout(function () {
	// do an second fetch of the data
	cachely.request(function (err, data) {
		console.log('after one second as specified in our method, the result data should be 2, as it was our second fetch:', data, err)
	})

	// do a subsequent fetch of the data that will be from the cache
	cachely.request(function (err, data) {
		console.log('after a tiny delay this will be from cache, the result data should still be 2:', data, err)
	})

	// peform a manual invalidation
	cachely.invalidate()

	// do a third fetch of the data
	cachely.request(function (err, data) {
		console.log('after one second as specified in our method, the result data should be 3, as it was our third fetch:', data, err)
	})

	// do a subsequent fetch of the data that will be from the cache
	cachely.request(function (err, data) {
		console.log('after a tiny delay this will be from cache, the result data should still be 3:', data, err)
	})
}, 3000)
```

<!-- HISTORY/ -->

## History
[Discover the change history by heading on over to the `HISTORY.md` file.](https://github.com/bevry/cachely/blob/master/HISTORY.md#files)

<!-- /HISTORY -->


<!-- CONTRIBUTE/ -->

## Contribute

[Discover how you can contribute by heading on over to the `CONTRIBUTING.md` file.](https://github.com/bevry/cachely/blob/master/CONTRIBUTING.md#files)

<!-- /CONTRIBUTE -->


<!-- BACKERS/ -->

## Backers

### Maintainers

These amazing people are maintaining this project:

- Benjamin Lupton <b@lupton.cc> (https://github.com/balupton)

### Sponsors

No sponsors yet! Will you be the first?

[![Gratipay donate button](https://img.shields.io/gratipay/bevry.svg)](https://www.gratipay.com/bevry/ "Donate weekly to this project using Gratipay")
[![Flattr donate button](https://img.shields.io/badge/flattr-donate-yellow.svg)](http://flattr.com/thing/344188/balupton-on-Flattr "Donate monthly to this project using Flattr")
[![PayPayl donate button](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QB8GQPZAH84N6 "Donate once-off to this project using Paypal")
[![BitCoin donate button](https://img.shields.io/badge/bitcoin-donate-yellow.svg)](https://bevry.me/bitcoin "Donate once-off to this project using BitCoin")
[![Wishlist browse button](https://img.shields.io/badge/wishlist-donate-yellow.svg)](https://bevry.me/wishlist "Buy an item on our wishlist for us")

### Contributors

No contributors yet! Will you be the first?
[Discover how you can contribute by heading on over to the `CONTRIBUTING.md` file.](https://github.com/bevry/cachely/blob/master/CONTRIBUTING.md#files)

<!-- /BACKERS -->


<!-- LICENSE/ -->

## License

Unless stated otherwise all works are:

- Copyright &copy; 2015+ Bevry Pty Ltd <us@bevry.me> (http://bevry.me)

and licensed under:

- The incredibly [permissive](http://en.wikipedia.org/wiki/Permissive_free_software_licence) [MIT License](http://opensource.org/licenses/mit-license.php)

<!-- /LICENSE -->


