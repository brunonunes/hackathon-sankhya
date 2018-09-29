import httpStatus from 'http-status'
import { success, notFound } from '../../services/response/'
import { Module } from '.'

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Module.count(query)
    .then(count => Module.find(query, select, cursor)
      .populate('company')
      .populate('skills')
      .then(modules => ({
        count,
        rows: modules.map(contempt => contempt.view(true))
      }))
    )
    .then(success(res))
    .catch(next)

export const indexFb = ({ querymen: { query, select, cursor } }, res, next) => {
  Module.count(query)
    .then(count => Module.find()
      .sort('createdAt')
      .populate('company')
      .populate('skills')
      .then(modules => ({
        messages: [
          {
            attachment: {
              type: 'template',
              payload: {
                template_type: 'generic',
                elements: modules.map(item => ({
                  title: item.name,
                  image_url: item.image,
                  subtitle: item.description,
                  buttons: [
                    {
                      type: 'show_block',
                      title: 'Quero fazer',
                      block_names: ['Quero fazer']
                    }
                  ]
                }))
              }
            }
          }
        ]
      }))
    )
    .then(success(res))
    .catch(next)
}


export const show = ({ params }, res, next) =>
  Module.findById(params.id)
    .then(notFound)
    .then(contempt => contempt.view())
    .then(success(res))
    .catch(next)

export const create = ({ bodymen: { body } }, res, next) => {
  Module.create({ ...body })
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
  Module.findById(params.id)
    .then(notFound)
    .then(entity => Object.assign(entity, body).save())
    .then(entity => entity.view(true))
    .then(success(res))
    .catch(next)


export const destroy = ({ params }, res, next) =>
  Module.findById(params.id)
    .then(notFound)
    .then(contempt => contempt.remove())
    .then(success(res, httpStatus.NO_CONTENT))
    .catch(next)
