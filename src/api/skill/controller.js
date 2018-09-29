import httpStatus from 'http-status'
import { success, notFound } from '../../services/response/'
import { Skill } from '.'
import { Student } from '../student'

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Skill.count(query)
    .then(count => Skill.find(query, select, cursor)
      .then(skills => ({
        count,
        rows: skills.map(contempt => contempt.view(true))
      }))
    )
    .then(success(res))
    .catch(next)

export const indexFb = ({ query }, res, next) =>
  Skill.find()
    .then(async (skills) => {
      if (query.skill) {
        const skill = await Skill.findOne({ _id: query.skill })
        const user = await Student.findOne({ email: query.email })
        if (user) {
          user.skills.push(query.skill)
          user.logs.push({
            message: `Usuário adicionou ${skill.name} à suas skills`
          })
          await user.save()
        }
      }

      const replies = skills.map(item => ({
        title: item.name,
        url: `https://hacka.ngrok.io/api/skills/fb?skill=${item._id}&email=${query.email}`,
        type: 'json_plugin_url'
      }))

      return {
        messages: [
          {
            text: query.skill ? 'Gostaria de adicionar mais uma?' : 'Quais as suas àreas de interesse?',
            quick_replies: [
              ...replies,
              {
                title: '👍 Encerrar',
                block_names: ['Encerrar']
              }
            ]
          }
        ]
      }
    })
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Skill.findById(params.id)
    .then(notFound)
    .then(contempt => contempt.view())
    .then(success(res))
    .catch(next)

export const create = ({ bodymen: { body } }, res, next) => {
  Skill.create({ ...body })
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
  Skill.findById(params.id)
    .then(notFound)
    .then(entity => Object.assign(entity, body).save())
    .then(entity => entity.view(true))
    .then(success(res))
    .catch(next)


export const destroy = ({ params }, res, next) =>
  Skill.findById(params.id)
    .then(notFound)
    .then(contempt => contempt.remove())
    .then(success(res, httpStatus.NO_CONTENT))
    .catch(next)
