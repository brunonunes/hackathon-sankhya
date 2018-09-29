import { Router } from 'express'
import student from './student'
import skill from './skill'
import company from './company'
import job from './job'
import module from './module'
import notification from './notification'
import question from './question'
import duel from './duel'

const router = new Router()

/**
 * @apiDefine master Master access only
 * You must pass `access_token` parameter or a Bearer Token authorization header
 * to access this endpoint.
 */
/**
 * @apiDefine admin Admin access only
 * You must pass `access_token` parameter or a Bearer Token authorization header
 * to access this endpoint.
 */
/**
 * @apiDefine user User access only
 * You must pass `access_token` parameter or a Bearer Token authorization header
 * to access this endpoint.
 */
/**
 * @apiDefine listParams
 * @apiParam {String} [q] Query to search.
 * @apiParam {Number{1..30}} [page=1] Page number.
 * @apiParam {Number{1..100}} [limit=30] Amount of returned items.
 * @apiParam {String[]} [sort=-createdAt] Order of returned items.
 * @apiParam {String[]} [fields] Fields to be returned.
 */
router.use('/students', student)
router.use('/duels', duel)
router.use('/skills', skill)
router.use('/companies', company)
router.use('/jobs', job)
router.use('/modules', module)
router.use('/notifications', notification)
router.use('/questions', question)



export default router
