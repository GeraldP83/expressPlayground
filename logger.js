function log(req, res, next) {
    console.log(`Logging... \n*Query: ${JSON.stringify(req.query)}  \n*Params: ${JSON.stringify(req.params)}`)
    next()
}

module.exports = log