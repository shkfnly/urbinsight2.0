'use strict'

// lngLat is being save as floats

exports.saveAudit = function * () {
  if (!this.request.body) {
    this.throw('The body is empty', 400)
  }

  var Audit = require('mongoose').model('Audit')
  // This is a geoJSON
  // var tempAudit = this.request.body
  try {
    var audit = new Audit(this.request.body)
    audit.geometry.coordinates = [audit.geometry.coordinates[0], audit.geometry.coordinates[1]]
    audit = yield audit.save()
  } catch (err) {
    this.throw(err)
  }
  this.status = 200
  this.body = { audit: this.audit }
}

exports.getAudits = function * () {
  let splitLngLat = (str) => {
    return str.split(',')
  }
  // if (!this.request.body) {
  //   this.throw('The body is empty', 400)
  // }
  let coords = [splitLngLat(this.query.a),
                splitLngLat(this.query.b),
                splitLngLat(this.query.c),
                splitLngLat(this.query.d),
                splitLngLat(this.query.a)]
  let parsedCoords = coords.map(function (point) {
    return [parseFloat(point[0]), parseFloat(point[1])]
  })
  var Audit = require('mongoose').model('Audit')
  try {
    var audits = yield Audit.find({'geometry':
      { $geoWithin:
        { $geometry:
          { type: 'Polygon',
            coordinates: [parsedCoords]
          }
        }
      }
    }).exec()
  } catch (err) {
    this.throw(err)
  }
  this.status = 200
  this.body = { audits: audits }
}
