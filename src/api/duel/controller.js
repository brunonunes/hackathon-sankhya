import httpStatus from 'http-status'
import { success, notFound } from '../../services/response/'
import { Question } from '../question'
import { Skill } from '../skill'
import { notificateUser } from '../../services/notification'
import { Student } from '../student'

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Question.count(query)
    .then(count => Question.find(query, select, cursor)
      .populate('skills')
      .then(question => ({
        count,
        rows: question.map(contempt => contempt.view(true))
      }))
    )
    .then(success(res))
    .catch(next)



export const dashboard = ({ querymen: { query, select, cursor } }, res, next) =>
  Question.find(query, select, cursor)
    .populate('skills')
    .then(async duels => {
      const array = []
      for (let question of duels) {
        question = question.view()
        question.correct = await Student.count({ correct: question.id })
        question.incorrect = await Student.count({ incorrect: question.id })
        array.push(question)
      }
      return array
    })
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Question.findById(params.id)
    .then(notFound)
    .then(contempt => contempt.view())
    .then(success(res))
    .catch(next)


export const selectSkill = ({ query }, res, next) => {
  Question.distinct('skills')
    .then(ids => Skill.find({
      _id: { $in: ids }
    })
      .then(async (skills) => {

        const replies = skills.map(item => ({
          title: item.name,
          url: `https://hacka.ngrok.io/api/duels/skills/${item._id}`,
          type: 'json_plugin_url'
        }))

        return {
          messages: [
            {
              text: 'Que legal, o que você gostaria de praticar agora?',
              quick_replies: [
                ...replies,
                {
                  title: '👍 Encerrar',
                  block_names: ['Fim do desafio']
                }
              ]
            }
          ]
        }
      }))
    .then(success(res))
    .catch(next)
}


export const bySkill = ({ params, query }, res, next) =>
  Student.findOne({ email: query.email })
    .then(user =>
      Question.findOne({
        $and: [{
          skills: params.id
        }, {

        }]
      })
        .then(async (question) => {
          if (!question) {
            return {
              messages: [
                {
                  text: '😱 😱 😱 😱  Você já fez todas as questões desta àrea. Você é fera!!',
                  quick_replies: [{
                    title: '🧐 Escolher outra àrea',
                    url: `https://hacka.ngrok.io/api/duels/skills`,
                    type: 'json_plugin_url'
                  }, {
                    title: '😴 Encerrar',
                    block_names: ['Fim do desafio']
                  }]
                }
              ]
            }
          }

          const student = await Student.findOne({ email: 'silva.cpp@gmail.com' })
          await notificateUser(student.fbId, 'Novo desafio', 'Broadcast-3')

          const options = [
            {
              text: 'Lá vai a pergunta...'
            }, {
              text: question.title
            }, {
              text: `A - ${question.optionA}`
            }, {
              text: `B - ${question.optionB}`
            }, {
              text: `C - ${question.optionC}`
            }, {
              text: `D - ${question.optionD}`
            }, {
              text: `E - ${question.optionE}`
            }]

          return {
            messages: [
              ...options,
              {
                text: 'Selecione uma das opções',
                quick_replies: [{
                  title: 'Opção A',
                  url: `https://hacka.ngrok.io/api/duels/answer/${question._id}?answer=A&skill=${params.id}`,
                  type: 'json_plugin_url'
                }, {
                  title: 'Opção B',
                  url: `https://hacka.ngrok.io/api/duels/answer/${question._id}?answer=B&skill=${params.id}`,
                  type: 'json_plugin_url'
                }, {
                  title: 'Opção C',
                  url: `https://hacka.ngrok.io/api/duels/answer/${question._id}?answer=C&skill=${params.id}`,
                  type: 'json_plugin_url'
                }, {
                  title: 'Opção D',
                  url: `https://hacka.ngrok.io/api/duels/answer/${question._id}?answer=D&skill=${params.id}`,
                  type: 'json_plugin_url'
                }, {
                  title: 'Opção E',
                  url: `https://hacka.ngrok.io/api/duels/answer/${question._id}?answer=E&skill=${params.id}`,
                  type: 'json_plugin_url'
                }]
              }
            ]
          }
        })
        .then(success(res))
        .catch(next)
    )

export const answer = ({ params, query }, res, next) =>
  Question.findOne({ _id: params.id })
    .then(async (question) => {

      const user = await Student.findOne({ email: query.email })
      if (question.correct === query.answer) {
        user.correct.push(question._id)
        await user.save()
        return {
          messages: [
            {
              text: 'Na mosca, você é foda 🤓, que tal praticar um pouco mais e virar um jedi supremo?',
              quick_replies: [{
                title: '💪 Praticar mais',
                url: `https://hacka.ngrok.io/api/duels/skills/${query.skill}`,
                type: 'json_plugin_url'
              }, {
                title: '😴 Encerrar',
                block_names: ['Fim do desafio']
              }]
            }
          ]
        }
      } else {
        //DOINCORRECT
        user.incorrect.push(question._id)
        await user.save()
        return {
          messages: [
            {
              text: `Poxa, a alternativa correta era ${question.correct}, se você quiser podemos praticar mais`,
              quick_replies: [{
                title: '💪 Praticar mais',
                url: `https://hacka.ngrok.io/api/duels/skills/${query.skill}`,
                type: 'json_plugin_url'
              }, {
                title: '😴 Encerrar',
                block_names: ['Fim do desafio']
              }]
            }
          ]
        }
      }

      
    })
    .then(success(res))
    .catch(next)


export const create = ({ bodymen: { body } }, res, next) => {
  Question.create(body)
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
  Question.findById(params.id)
    .then(notFound)
    .then(entity => Object.assign(entity, body).save())
    .then(entity => entity.view(true))
    .then(success(res))
    .catch(next)


export const destroy = ({ params }, res, next) =>
  Question.findById(params.id)
    .then(notFound)
    .then(contempt => contempt.remove())
    .then(success(res, httpStatus.NO_CONTENT))
    .catch(next)
