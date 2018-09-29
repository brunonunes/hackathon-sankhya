import httpStatus from 'http-status'

export const success = (res, status) => (entity) => {
  if (entity) {
    res.status(status || httpStatus.OK).json(entity)
  }
  return null
}

export const notFound = (entity) => {
  if (entity) {
    return entity
  }
  return Promise.reject({
    status: '404'
  })
}

export const authorOrAdmin = (res, user, userField) => (entity) => {
  if (entity) {
    const isAdmin = user.role === 'admin'
    const isAuthor = entity[userField] && entity[userField].equals(user.id)
    if (isAuthor || isAdmin) {
      return entity
    }
    res.status(httpStatus.UNAUTHORIZED).end()
  }
  return null
}
