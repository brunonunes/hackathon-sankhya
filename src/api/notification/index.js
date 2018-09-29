import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { index, indexFb, show, create, update, destroy } from './controller'
import { schema } from './model'

export Notification, { schema } from './model'

const router = new Router()
const { message } = schema.tree

router.get('/',
  query(),
  index)

router.get('/fb',
  query(),
  indexFb)

router.get('/:id',
  show)

router.post('/',
  body({ message }),
  create)

router.put('/:id',
  body({ message }),
  update)

router.delete('/:id',
  destroy)

export default router
