<!-- TITLE/ -->

<h1>cachely</h1>

<!-- /TITLE -->


<!-- BADGES/ -->

<span class="badge-travisci"><a href="http://travis-ci.com/bevry/cachely" title="Check this project's build status on TravisCI"><img src="https://img.shields.io/travis/com/bevry/cachely/master.svg" alt="Travis CI Build Status" /></a></span>
<span class="badge-npmversion"><a href="https://npmjs.org/package/cachely" title="View this project on NPM"><img src="https://img.shields.io/npm/v/cachely.svg" alt="NPM version" /></a></span>
<span class="badge-npmdownloads"><a href="https://npmjs.org/package/cachely" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/cachely.svg" alt="NPM downloads" /></a></span>
<span class="badge-daviddm"><a href="https://david-dm.org/bevry/cachely" title="View the status of this project's dependencies on DavidDM"><img src="https://img.shields.io/david/bevry/cachely.svg" alt="Dependency Status" /></a></span>
<span class="badge-daviddmdev"><a href="https://david-dm.org/bevry/cachely#info=devDependencies" title="View the status of this project's development dependencies on DavidDM"><img src="https://img.shields.io/david/dev/bevry/cachely.svg" alt="Dev Dependency Status" /></a></span>
<br class="badge-separator" />
<span class="badge-githubsponsors"><a href="https://github.com/sponsors/balupton" title="Donate to this project using GitHub Sponsors"><img src="https://img.shields.io/badge/github-donate-yellow.svg" alt="GitHub Sponsors donate button" /></a></span>
<span class="badge-patreon"><a href="https://patreon.com/bevry" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a></span>
<span class="badge-flattr"><a href="https://flattr.com/profile/balupton" title="Donate to this project using Flattr"><img src="https://img.shields.io/badge/flattr-donate-yellow.svg" alt="Flattr donate button" /></a></span>
<span class="badge-liberapay"><a href="https://liberapay.com/bevry" title="Donate to this project using Liberapay"><img src="https://img.shields.io/badge/liberapay-donate-yellow.svg" alt="Liberapay donate button" /></a></span>
<span class="badge-buymeacoffee"><a href="https://buymeacoffee.com/balupton" title="Donate to this project using Buy Me A Coffee"><img src="https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg" alt="Buy Me A Coffee donate button" /></a></span>
<span class="badge-opencollective"><a href="https://opencollective.com/bevry" title="Donate to this project using Open Collective"><img src="https://img.shields.io/badge/open%20collective-donate-yellow.svg" alt="Open Collective donate button" /></a></span>
<span class="badge-crypto"><a href="https://bevry.me/crypto" title="Donate to this project using Cryptocurrency"><img src="https://img.shields.io/badge/crypto-donate-yellow.svg" alt="crypto donate button" /></a></span>
<span class="badge-paypal"><a href="https://bevry.me/paypal" title="Donate to this project using Paypal"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a></span>
<span class="badge-wishlist"><a href="https://bevry.me/wishlist" title="Buy an item on our wishlist for us"><img src="https://img.shields.io/badge/wishlist-donate-yellow.svg" alt="Wishlist browse button" /></a></span>

<!-- /BADGES -->


<!-- DESCRIPTION/ -->

A tiny wrapper that sits around your request function that caches its data for a specified duration, provides updates as requested rather than polling each interval

<!-- /DESCRIPTION -->


<!-- INSTALL/ -->

<h2>Install</h2>

<a href="https://npmjs.com" title="npm is a package manager for javascript"><h3>npm</h3></a>
<ul>
<li>Install: <code>npm install --save cachely</code></li>
<li>Require: <code>require('cachely')</code></li>
</ul>

<a href="https://jspm.io" title="Native ES Modules CDN"><h3>jspm</h3></a>

``` html
<script type="module">
    import * as pkg from '//dev.jspm.io/cachely'
</script>
```

<h3><a href="https://editions.bevry.me" title="Editions are the best way to produce and consume packages you care about.">Editions</a></h3>

<p>This package is published with the following editions:</p>

<ul><li><code>cachely/source/index.ts</code> is typescript source code with import for modules</li>
<li><code>cachely/edition-browsers/index.js</code> is typescript compiled for browsers with import for modules</li>
<li><code>cachely</code> aliases <code>cachely/edition-node-12/index.js</code></li>
<li><code>cachely/edition-node-12/index.js</code> is typescript compiled for node.js 12 with require for modules</li></ul>

<!-- /INSTALL -->


## Usage

[API Documentation.](http://master.cachely.bevry.surge.sh/docs/)

```javascript
let fetches = 0
const cachely = require('cachely').create({
    // The method that will fetch the data
    retrieve() {
        return new Promise(function(resolve) {
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
    log: console.log
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
setTimeout(function() {
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
```

<!-- HISTORY/ -->

<h2>History</h2>

<a href="https://github.com/bevry/cachely/blob/master/HISTORY.md#files">Discover the release history by heading on over to the <code>HISTORY.md</code> file.</a>

<!-- /HISTORY -->


<!-- CONTRIBUTE/ -->

<h2>Contribute</h2>

<a href="https://github.com/bevry/cachely/blob/master/CONTRIBUTING.md#files">Discover how you can contribute by heading on over to the <code>CONTRIBUTING.md</code> file.</a>

<!-- /CONTRIBUTE -->


<!-- BACKERS/ -->

<h2>Backers</h2>

<h3>Maintainers</h3>

These amazing people are maintaining this project:

<ul><li><a href="http://balupton.com">Benjamin Lupton</a> — <a href="https://github.com/bevry/cachely/commits?author=balupton" title="View the GitHub contributions of Benjamin Lupton on repository bevry/cachely">view contributions</a></li></ul>

<h3>Sponsors</h3>

No sponsors yet! Will you be the first?

<span class="badge-githubsponsors"><a href="https://github.com/sponsors/balupton" title="Donate to this project using GitHub Sponsors"><img src="https://img.shields.io/badge/github-donate-yellow.svg" alt="GitHub Sponsors donate button" /></a></span>
<span class="badge-patreon"><a href="https://patreon.com/bevry" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a></span>
<span class="badge-flattr"><a href="https://flattr.com/profile/balupton" title="Donate to this project using Flattr"><img src="https://img.shields.io/badge/flattr-donate-yellow.svg" alt="Flattr donate button" /></a></span>
<span class="badge-liberapay"><a href="https://liberapay.com/bevry" title="Donate to this project using Liberapay"><img src="https://img.shields.io/badge/liberapay-donate-yellow.svg" alt="Liberapay donate button" /></a></span>
<span class="badge-buymeacoffee"><a href="https://buymeacoffee.com/balupton" title="Donate to this project using Buy Me A Coffee"><img src="https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg" alt="Buy Me A Coffee donate button" /></a></span>
<span class="badge-opencollective"><a href="https://opencollective.com/bevry" title="Donate to this project using Open Collective"><img src="https://img.shields.io/badge/open%20collective-donate-yellow.svg" alt="Open Collective donate button" /></a></span>
<span class="badge-crypto"><a href="https://bevry.me/crypto" title="Donate to this project using Cryptocurrency"><img src="https://img.shields.io/badge/crypto-donate-yellow.svg" alt="crypto donate button" /></a></span>
<span class="badge-paypal"><a href="https://bevry.me/paypal" title="Donate to this project using Paypal"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a></span>
<span class="badge-wishlist"><a href="https://bevry.me/wishlist" title="Buy an item on our wishlist for us"><img src="https://img.shields.io/badge/wishlist-donate-yellow.svg" alt="Wishlist browse button" /></a></span>

<h3>Contributors</h3>

These amazing people have contributed code to this project:

<ul><li><a href="http://balupton.com">Benjamin Lupton</a> — <a href="https://github.com/bevry/cachely/commits?author=balupton" title="View the GitHub contributions of Benjamin Lupton on repository bevry/cachely">view contributions</a></li>
<li><a href="http://github.com/apps/dependabot-preview">dependabot-preview[bot]</a> — <a href="https://github.com/bevry/cachely/commits?author=dependabot-preview[bot]" title="View the GitHub contributions of dependabot-preview[bot] on repository bevry/cachely">view contributions</a></li></ul>

<a href="https://github.com/bevry/cachely/blob/master/CONTRIBUTING.md#files">Discover how you can contribute by heading on over to the <code>CONTRIBUTING.md</code> file.</a>

<!-- /BACKERS -->


<!-- LICENSE/ -->

<h2>License</h2>

Unless stated otherwise all works are:

<ul><li>Copyright &copy; 2015+ <a href="http://bevry.me">Bevry Pty Ltd</a></li></ul>

and licensed under:

<ul><li><a href="http://spdx.org/licenses/MIT.html">MIT License</a></li></ul>

<!-- /LICENSE -->
