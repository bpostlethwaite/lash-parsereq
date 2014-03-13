/*
 * Query string parse Request body
 * returns (next, parsedbody) to
 * next middleware in stack
 */
var qs = require('querystring')

module.exports = parseReq

function parseReq (next) {

  var req = this.req
  var res = this.res

  var body = ''
  req.setEncoding('utf8')
  req.on('data', function (data) {
    body += data
    if (body.length > 1e3) {
      // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQ
      req.connection.destroy()
      res.writeHead(413, {'Content-Type': 'text/plain'})
      res.end("req body too large")
      return next({msg: "req body too large", code: 413})
    }
  })

  req.on('end', function () {
    next(null, qs.parse(body))
  })
}
