import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { index, show, create, update, destroy } from './controller'
import { schema } from './model'

export Student, { schema } from './model'

const router = new Router()
const { name, email, age, graduation } = schema.tree


router.get('/',
  query(),
  index)

router.get('/:id',
  show)

router.post('/',
  body({ name, email, age, graduation }),
  create)

router.put('/:id',
  body({ name, email, age, graduation }),
  update)

router.delete('/:id',
  destroy)

export default router
