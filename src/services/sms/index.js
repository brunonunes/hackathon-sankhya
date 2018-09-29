import soap from 'soap'
import moment from 'moment'

export const sendSMS = async (phone, message) => {
  console.log(process.env.SMS_SOAP_URL)
  soap.createClient(process.env.SMS_SOAP_URL, (err, client) => {
    console.log(message)
    client.envioAvulso({
        token: process.env.SMS_TOKEN,
        carteira: process.env.SMS_CARTEIRA,
        msg: `${message} - TIME A`,
        fones: phone,
        data: moment().format('YYYY-MM-DD HH:mm:SS'),
        dadocliente: 'TIME A'
    }, (err, result) => {
        console.log(err, result)
    })
  })
}
