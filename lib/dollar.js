var Q = require("q")
var cheerio = require("cheerio")
var request = require("request")
var jsdom = require("jsdom")
var _ = require("lodash")
var jQueryPromise = require('q-io/fs').read(__dirname + '/jquery-3.1.0.js')

var defaults = {
  fullJQuery: true,
  url: undefined,
  html: undefined,
  htmlPromise: undefined
}

exports.get = function(urlOrOptions) {
  var opts = buildOptions(urlOrOptions)
  if (opts.fullJQuery) {
    return jsdomify(opts.htmlPromise)
  } else {
    return cheerify(opts.htmlPromise)
  }
}

function cheerify(htmlPromise) {
  var deferred = Q.defer()
  htmlPromise.then(function(body) {
    var $ = cheerio.load(body)
    deferred.resolve($)
  })
  return deferred.promise
}

function jsdomify(htmlPromise) {
  var deferred = Q.defer()
  Q.all([jQueryPromise, htmlPromise]).spread(function(jquery, body) {
    jsdom.env({
      html: body,
      src: [jquery],
      done: function(errors, window) {
        if (errors) {
          deferred.reject(errors)
        } else {
          deferred.resolve(window.$)
        }
      }
    })
  })
  return deferred.promise
}

function buildOptions(urlOrOptions) {
  var options = moveUrlToDefaultOptions(urlOrOptions)
  var htmlPromise = buildHtmlPromise(options)
  return _.extend(options, { htmlPromise: htmlPromise })
}

function buildHtmlPromise(options) {
  if (options.url) {
    return promiseFromUrl(options.url)
  } else if (options.html) {
    return Q(options.html)
  } else if (options.htmlPromise) {
    return options.htmlPromise
  } else {
    throw 'Did not get url or html to dollarify.'
  }
}

function promiseFromUrl(url) {
  var deferred = Q.defer()
  request(url, function(err, resp, body) {
    if (err) {
      deferred.reject(err)
    } else {
      deferred.resolve(body)
    }
  })
  return deferred.promise
}

function moveUrlToDefaultOptions(urlOrOptions) {
  if (typeof urlOrOptions === 'string') {
    return _.extend({}, defaults, { url: urlOrOptions })
  } else {
    return _.extend({}, defaults, urlOrOptions)
  }
}
