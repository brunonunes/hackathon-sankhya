import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { index, show, selectSkill, bySkill, answer, dashboard } from './controller'


const router = new Router()


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
  

export default router
