import request from 'request-promise'

export const notificateUser = (fbId, message, broadcast = 'Broadcast-1') =>
  request({
    uri: `https://api.chatfuel.com/bots/5baece5276ccbc32a24e62ac/users/${fbId}/send?chatfuel_token=mELtlMAHYqR0BvgEiMq8zVek3uYUK3OJMbtyrdNPTrQB9ndV0fM7lWTFZbM4MZvD&chatfuel_message_tag=NON_PROMOTIONAL_SUBSCRIPTION&chatfuel_block_name=${broadcast}&message=${message}`,
    json: true,
    method: 'POST'
  })
