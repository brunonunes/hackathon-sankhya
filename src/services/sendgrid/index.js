import { sendgridKey, defaultEmail } from '../../config'
import mailer from '@sendgrid/mail'

export const sendMail = ({
  fromEmail = defaultEmail,
  toEmail,
  templateId,
  substitutions
}) => {
  mailer.setApiKey(sendgridKey)
  const msg = {
    to: toEmail,
    from: fromEmail,
    templateId,
    substitutions
  }
  return mailer.send(msg)
}
