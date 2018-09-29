import mongoose, {
  Schema
} from 'mongoose'
import mongooseKeywords from 'mongoose-keywords'

const jobSchema = new Schema({
  name: String,
  description: String,
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company'
  },
  skills: [{
    type: Schema.Types.ObjectId,
    ref: 'Skill'
  }]
}, {
  timestamps: true,
  usePushEach: true
})


jobSchema.methods = {
  view(full) {
    const view = {}
    let fields = ['id', 'name', 'description', 'company', 'skills', 'createdAt']
    if (full) {
      fields = [...fields]
    }

    fields.forEach((field) => {
      view[field] = this[field]
    })

    return view
  }
}

jobSchema.plugin(mongooseKeywords, {
  paths: ['name', 'description']
})

const model = mongoose.model('Job', jobSchema)

export const schema = model.schema
export default model
