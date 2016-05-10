import path from 'path'
import express from 'express'
var router = express.Router()

var staticPath = path.resolve('dist/static')
console.log('Serving static files from: ' + staticPath)

router.use('/static', express.static(staticPath))

export default router
