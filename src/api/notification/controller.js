import httpStatus from 'http-status'
import { success, notFound } from '../../services/response/'
import { Notification } from '.'
import { notificateUser } from '../../services/notification'
import { Student } from '../student'

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Notification.count(query)
    .then(count => Notification.find(query, select, cursor)
      .populate('company')
      .populate('skills')
      .then(modules => ({
        count,
        rows: modules.map(contempt => contempt.view(true))
      }))
    )
    .then(success(res))
    .catch(next)


export const indexFb = ({ querymen: { query, select, cursor } }, res, next) =>
  Notification.count(query)
    .then(count => Notification.find(query, select, cursor)
      .populate('company')
      .populate('skills')
      .then(modules => ({
        messages: [
          {
            attachment: {
              type: 'template',
              payload: {
                template_type: 'list',
                top_element_style: 'large',
                elements: modules.map(item => ({
                  title: item.name,
                  image_url: item.company.image,
                  subtitle: `Em: ${item.company.name}`,
                  buttons: [
                    {
                      type: 'web_url',
                      url: 'https://rockets.chatfuel.com/store',
                      title: 'View Item'
                    }
                  ]
                })
                )
              }
            }
          }
        ]
      }))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Notification.findById(params.id)
    .then(notFound)
    .then(contempt => contempt.view())
    .then(success(res))
    .catch(next)

export const create = ({ bodymen: { body } }, res, next) => {
  Notification.create({ ...body })
    .then(async (notification) => {
      const users = await Student.find()
      for (const item of users) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        await notificateUser(item.fbId, notification.message)
      }
      return notification
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
  Notification.findById(params.id)
    .then(notFound)
    .then(entity => Object.assign(entity, body).save())
    .then(entity => entity.view(true))
    .then(success(res))
    .catch(next)


export const destroy = ({ params }, res, next) =>
  Notification.findById(params.id)
    .then(notFound)
    .then(contempt => contempt.remove())
    .then(success(res, httpStatus.NO_CONTENT))
    .catch(next)
