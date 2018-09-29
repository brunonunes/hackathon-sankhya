import mongoose, {
  Schema
} from 'mongoose'
import mongooseKeywords from 'mongoose-keywords'

const companySchema = new Schema({
  name: String,
  description: String,
  image: String
}, {
  timestamps: true
})


companySchema.methods = {
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

companySchema.plugin(mongooseKeywords, {
  paths: ['name', 'description']
})

const model = mongoose.model('Company', companySchema)

export const schema = model.schema
export default model
