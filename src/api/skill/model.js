import mongoose, {
  Schema
} from 'mongoose'
import mongooseKeywords from 'mongoose-keywords'

const skillSchema = new Schema({
  name: String,
  description: String,
  image: String
}, {
  timestamps: true
})


skillSchema.methods = {
  view(full) {
    const view = {}
    let fields = ['id', 'name', 'description', 'image', 'createdAt']
    if (full) {
      fields = [...fields]
    }

    fields.forEach((field) => {
      view[field] = this[field]
    })

    return view
  }
}

skillSchema.plugin(mongooseKeywords, {
  paths: ['name', 'description']
})

const model = mongoose.model('Skill', skillSchema)

export const schema = model.schema
export default model
