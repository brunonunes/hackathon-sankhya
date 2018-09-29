import express from 'express'
import cors from 'cors'
import compression from 'compression'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import path from 'path'
import { errorHandler as queryErrorHandler } from 'querymen'
import { errorHandler as bodyErrorHandler } from 'bodymen'
const referrerPolicy = require('referrer-policy')

import { env } from '../../config'

export default (apiRoot, routes) => {
  const app = express()

  /* istanbul ignore next */
  if (env !== 'test') {
    app.use(cors())
    app.use(compression())
    app.use(morgan('dev'))
  }

  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(apiRoot, routes)
  app.use(cors())
  app.use(referrerPolicy({ policy: 'origin' }))
  app.use(express.static(path.join(__dirname, '/public')))
  app.set('views', path.join('views'))
  app.engine('html', require('ejs').renderFile)
  app.use(express.static('public'))

  app.get('*', (req, res) => {
    res.render('index.html')
  })

  app.use(queryErrorHandler())
  app.use(bodyErrorHandler())
  app.use((err, req, res, next) => {
    if (err.status) {
      res.status(err.status).send(err.error)
    } else {
      next(err)
    }
  })

  return app
}
