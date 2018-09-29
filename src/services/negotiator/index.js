import {
  User
} from '../../api/user'
import {
  Discount
} from '../../api/discount'
import {
  Contempt
} from '../../api/contempt'
import {
  Billing
} from '../../api/billing'
import {
  Offer
} from '../../api/offer'
import moment from 'moment'


export const negotiator = async (user, selectedDate = new Date(), entry = 4000) => {
  console.log("SELECTEEEEED DATEEEEE", selectedDate)
  selectedDate = selectedDate ? selectedDate : new Date()
  const discounts = await Discount.find()
  const contempts = await Contempt.find()

  const billings = await Billing.find({
    user: user._id,
    expirationDate: {
      $lt: selectedDate
    },
    status: 1
  })


  let totalBillings = 0
  let maxDistance = -1

  for (const billing of billings) {
    totalBillings += billing.value
    const expirationDate = moment(billing.expirationDate)
    const distance = moment(selectedDate).diff(expirationDate, 'days')
    maxDistance = Math.max(maxDistance, distance)
  }


  const selectedDiscount = discounts.find(item =>  maxDistance >= item.begin && maxDistance <= item.end )
  const selectedContempt = contempts.find(item =>  maxDistance >= item.begin && maxDistance <= item.end )

  const contemptDays = selectedContempt ? selectedContempt.days : 0  
  const contemptFee = selectedContempt ? selectedContempt.fee : 0  

  const sightFee = selectedDiscount ? (1 - selectedDiscount.sightFee / 100) : 1
  const installmentFee = selectedDiscount ? (1 - selectedDiscount.installmentFee / 100) : 1

  const charges = Math.pow( (contemptFee / 100) + 1 , maxDistance / 30)

  
  const dueAmount = Math.round(totalBillings * charges)
  const chargesAmount = dueAmount - totalBillings

  const dueAmoutWithSight = Math.round(dueAmount * sightFee)
  const dueAmoutWithInstallment = Math.round(entry + (((dueAmount - entry) * 1.20) * (installmentFee)))
  const minEntry = Math.max(4000, Math.round(dueAmoutWithInstallment * 0.05))

  console.log(maxDistance)

  console.log("DEBUG", chargesAmount, dueAmountWithEntry, dueAmoutWithInstallment)

  const dueAmountWithEntry = dueAmoutWithInstallment - minEntry

  let maxInstallment = dueAmountWithEntry
  let installments = 1
  for(installments = 1; maxInstallment > 2000; installments++){
    maxInstallment = dueAmountWithEntry / installments
  }


  const offer = new Offer({
    status: '',
    dueAmoutWithSight,
    dueAmoutWithInstallment,
    minEntry,
    maxInstallment: Math.max(1, installments - 2),
    user: user._id,
    billings: billings.map(item => item._id)
  })



  for(const billing of offer.billings){
    await Billing.findOneAndUpdate({
        _id: billing
    },{
        $set: { botStatus: 'Em andamento'}
    })
  }


  return offer.save()
}


export default negotiator
