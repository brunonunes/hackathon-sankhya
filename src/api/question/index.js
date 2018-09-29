import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { index, show, create, update, destroy, selectSkill, bySkill, answer, dashboard } from './controller'
import { schema } from './model'

export Question, { schema } from './model'

const router = new Router()
const { title, optionA, optionB, optionC, optionD, optionE, correct, skills } = schema.tree


router.get('/',
  query(),
  index)

router.get('/dashboard',
  query(),
  dashboard)

router.get('/skills',
  query(),
  selectSkill)

router.get('/skills/:id',
  query(),
  bySkill)

router.get('/answer/:id',
  query(),
  answer)

router.get('/:id',
  show)

router.post('/',
  body({ title, optionA, optionB, optionC, optionD, optionE, correct, skills }),
  create)

router.put('/:id',
  body({ title, optionA, optionB, optionC, optionD, optionE, correct, skills }),
  update)

router.delete('/:id',
  destroy)

export default router
