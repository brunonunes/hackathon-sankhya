import httpStatus from 'http-status'
import { success, notFound } from '../../services/response/'
import { Company } from '.'

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Company.count(query)
    .then(count => Company.find(query, select, cursor)
      .then(contempts => ({
        count,
        rows: contempts.map(contempt => contempt.view(true))
      }))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Company.findById(params.id)
    .then(notFound)
    .then(contempt => contempt.view())
    .then(success(res))
    .catch(next)

export const create = ({ bodymen: { body } }, res, next) => {
  Company.create({ ...body })
    .then(success(res))
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        res.status(httpStatus.CONFLICT).json({
          valid: false,
          param: 'email',
          message: 'email already registered'
        })
      } else {
        next(err)
      }
    })
}

export const update = ({ bodymen: { body }, params, contempt }, res, next) =>
  Company.findById(params.id)
    .then(notFound)
    .then(entity => Object.assign(entity, body).save())
    .then(entity => entity.view(true))
    .then(success(res))
    .catch(next)


export const destroy = ({ params }, res, next) =>
  Company.findById(params.id)
    .then(notFound)
    .then(contempt => contempt.remove())
    .then(success(res, httpStatus.NO_CONTENT))
    .catch(next)
