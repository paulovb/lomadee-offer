/**
 * Module dependencies
 */
var request = require('superagent')
  , _ = require('underscore');

// Endpoint template
var endpoint = _.template('http://<%=service%>/service/<%=method%>/lomadee/<%=id%>/<%=country%>/');

module.exports = function (opts) {
  return new Lomadee(opts);
};

var Lomadee = function Lomadee (opts) {
  // Use production by default
  this._service = 'bws.buscape.com';

  // Allow keywords string in place of opts
  opts = 'string' === typeof opts ? {keywords: opts} : opts;

  if (opts.keywords) {
    this._keywords = opts.keywords;
    this.mode = 'search';
  }
};

// Set application id
Lomadee.prototype.id = function (id) {
  return this._id = id, this;
};

// Set source id, whatever the hell that is
Lomadee.prototype.source = function (sourceId) {
  return this._sourceId = sourceId, this;
};

// Set search country
Lomadee.prototype.country = function (country) {
  return this._country = country, this;
};

Lomadee.prototype.country = function (country) {
  return this._country = country, this;
};

// Enable or disable test mode (make calls to the sanbox, rather than primary)
Lomadee.prototype.test = function (test) {
  // Default test to true
  test = (arguments.length === 0 ? true : !!test)
  return this._service = test ? 'sandbox.buscape.com' : 'bws.buscape.com', this;
};

// Return a limited number of results
Lomadee.prototype.limit = function (limit) {
  // Don't accept falsy or 0 limits
  if (!limit) return this;
  return this._limit = limit, this;
};

// Return only one result
Lomadee.prototype.one = function (one) {
  // Default one to true
  one = (arguments.length === 0 ? true : !!one)
  return this._one = one, this;
};

// Set caller ip address
Lomadee.prototype.client = function (ip) {
  return this._client = ip, this;
}

Lomadee.prototype.done = function (cb) {
  request
    .get(endpoint({
      service: this._service,
      method: 'findOfferList',
      id: this._id,
      country: this._country || 'BR'
    }))
    .query({keyword: this._keywords})
    .query({clientIp: this._client})
    .query({sourceId: this._sourceId})
    .query({format: 'json'})
    .end(function (err, res) {
      if (err) return cb(err);
      // No products found
      if (!res.body.offer) res.body.offer = [];

      // Format results
      var formatted = format(res.body.offer);

      // Limit
      if (this._limit) {
        formatted = _.first(formatted, this._limit);
      }

      // One
      if (this._one) {
        formatted = _.first(formatted) || null;
      }

      return cb(null, formatted);
    }.bind(this));
};

var format = function (offers) {
  return offers.map(function (offer) {
    var p = offer.offer
      , name = p.offername || p.offershortname
      , shortname = p.offershortname
      , price = p.price.value
      , currency = p.price.currency.abbreviation
      , thumbnail = p.thumbnail.url
      , link = productLink(p.links)
      , coupon = p.seller.coupon.id
      , sellerlink = sellerThumbnail(p.seller.links)
      , sellerthumbnail = p.seller.thumbnail.url
      , id = p.id;

    // Filter unusable results
    if (!p || !name || !price || !link) return null;

    return {
      name: name,
      shortname: shortname,
      price: price,
      currency: currency,
      thumbnail: thumbnail,
      url: link,
      coupon: coupon,
      sellerlink: sellerlink,
      sellerthumbnail: sellerthumbnail,
      id: id
    }
  })
  .filter(function (p) {
    return p !== null
  });
};

var productLink = function (links) {
  var productLink = _.find(links, function (l) {
    return l.link.type === 'offer';
  });

  return productLink.link.url || null;
};

var sellerThumbnail = function (links) {
  var sellerLink = _.find(links, function (l) {
    return l.link.type === 'seller';
  });

  return sellerLink.link.url || null;
};
