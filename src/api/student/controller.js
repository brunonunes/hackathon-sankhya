import httpStatus from 'http-status'
import { success, notFound } from '../../services/response/'
import { Student } from '.'

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Student.count(query)
    .then(count => Student.find(query, select, cursor)
      .populate('skills')
      .then(contempts => ({
        count,
        rows: contempts.map(contempt => contempt.view(true))
      }))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Student.findById(params.id)
    .then(notFound)
    .then(contempt => contempt.view())
    .then(success(res))
    .catch(next)

export const create = ({ bodymen, body }, res, next) => {
  Student.create({
    name: `${body['first name']} ${body['last name']}`,
    age: body.idade,
    graduation: body.ano_graduacao,
    fbId: body['messenger user id'],
    email: body.email,
    logs: [{
      message: 'Usuário entrou para a plataforma via Facebook'
    }]
  })
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
  Student.findById(params.id)
    .then(notFound)
    .then(entity => Object.assign(entity, body).save())
    .then(entity => entity.view(true))
    .then(success(res))
    .catch(next)


export const destroy = ({ params }, res, next) =>
  Student.findById(params.id)
    .then(notFound)
    .then(contempt => contempt.remove())
    .then(success(res, httpStatus.NO_CONTENT))
    .catch(next)
