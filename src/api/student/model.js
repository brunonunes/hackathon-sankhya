import mongoose, {
  Schema
} from 'mongoose'
import mongooseKeywords from 'mongoose-keywords'

const studentSchema = new Schema({
  name: String,
  email: String,
  age: Number,
  graduation: String,
  curriculum: String,
  fbId: String,
  correct: [{
    type: Schema.Types.ObjectId,
    ref: 'Question'
  }],
  incorrect: [{
    type: Schema.Types.ObjectId,
    ref: 'Question'
  }],
  logs: [{
    message: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  skills: [{
    type: Schema.Types.ObjectId,
    ref: 'Skill'
  }]
}, {
  timestamps: true,
  usePushEach: true
})


studentSchema.methods = {
  view(full) {
    const view = {}
    let fields = ['id', 'name', 'email', 'graduation', 'curriculum', 'age', 'skills', 'logs', 'createdAt']
    if (full) {
      fields = [...fields]
    }

    fields.forEach((field) => {
      view[field] = this[field]
    })

    return view
  }
}

studentSchema.plugin(mongooseKeywords, {
  paths: ['name', 'email']
})

const model = mongoose.model('Student', studentSchema)

export const schema = model.schema
export default model
