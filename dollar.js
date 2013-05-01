var Q = require("q")
var cheerio = require("cheerio")
var request = require("request")
var jsdom = require("jsdom")
var defaults = {
  fullJQuery: true
}

exports.get = function(url, options) {
  var opts = options || defaults
  var deferred = Q.defer()
  request(url, function(err, resp, body){
    if (err) {
      deferred.reject(err)
    } else {
      if (opts.fullJQuery) {
        jsdomify(body, deferred);
      } else {
        cheerify(body, deferred);
      }
    }
  })
  return deferred.promise
}

function cheerify(body, deferred) {
  var $ = cheerio.load(body)
  deferred.resolve($)
}

function jsdomify(body, deferred) {
  jsdom.env(
    body,
    ['http://code.jquery.com/jquery.js'],
    function(errors, window) {
      if (errors) {
        deferred.reject(errors)
      } else {
        deferred.resolve(window.$)
      }
    }
  )
}
