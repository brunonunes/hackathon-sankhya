import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { index, indexFb, show, create, update, destroy } from './controller'
import { schema } from './model'

export Module, { schema } from './model'

const router = new Router()
const { name, description, image } = schema.tree

router.get('/',
  query(),
  index)

router.get('/fb',
  query(),
  indexFb)

router.get('/:id',
  show)

router.post('/',
  body({ name, description, image }),
  create)

router.put('/:id',
  body({ name, description, image }),
  update)

router.delete('/:id',
  destroy)

export default router
