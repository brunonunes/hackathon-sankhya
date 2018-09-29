import mongoose, {
  Schema
} from 'mongoose'
import mongooseKeywords from 'mongoose-keywords'

const questionSchema = new Schema({
  title: String,
  optionA: String,
  optionB: String,
  optionC: String,
  optionD: String,
  optionE: String,
  correct: String,
  skills: [{
    type: Schema.Types.ObjectId,
    ref: 'Skill'
  }]
}, {
  timestamps: true,
  usePushEach: true
})


questionSchema.methods = {
  view(full) {
    const view = {}
    let fields = ['id', 'title', 'optionA', 'optionB', 'optionC', 'optionD', 'optionE', 'correct', 'skills', 'createdAt']
    if (full) {
      fields = [...fields]
    }

    fields.forEach((field) => {
      view[field] = this[field]
    })

    return view
  }
}

questionSchema.plugin(mongooseKeywords, {
  paths: ['title']
})

const model = mongoose.model('Question', questionSchema)

export const schema = model.schema
export default model
