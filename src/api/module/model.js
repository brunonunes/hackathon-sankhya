import mongoose, {
  Schema
} from 'mongoose'
import mongooseKeywords from 'mongoose-keywords'

const moduleSchema = new Schema({
  name: String,
  description: String,
  image: String
}, {
  timestamps: true,
  usePushEach: true
})


moduleSchema.methods = {
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

moduleSchema.plugin(mongooseKeywords, {
  paths: ['name', 'description']
})

const model = mongoose.model('Module', moduleSchema)

export const schema = model.schema
export default model
