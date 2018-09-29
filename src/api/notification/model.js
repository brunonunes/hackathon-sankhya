import mongoose, {
  Schema
} from 'mongoose'
import mongooseKeywords from 'mongoose-keywords'

const notificationSchema = new Schema({
  message: String,
  students: [{
    type: Schema.Types.ObjectId,
    ref: 'Student'
  }]
}, {
  timestamps: true,
  usePushEach: true
})


notificationSchema.methods = {
  view(full) {
    const view = {}
    let fields = ['id', 'message', 'students', 'createdAt']
    if (full) {
      fields = [...fields]
    }

    fields.forEach((field) => {
      view[field] = this[field]
    })

    return view
  }
}

notificationSchema.plugin(mongooseKeywords, {
  paths: ['message']
})

const model = mongoose.model('Notification', notificationSchema)

export const schema = model.schema
export default model
