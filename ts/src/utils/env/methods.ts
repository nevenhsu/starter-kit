import _ from 'lodash'

export function toArray(val: string | undefined) {
  const value = _.split(val, ',').map(el => _.trim(el))
  return _.compact(value)
}

export function toBool(value: any) {
  if (_.isNil(value)) {
    return undefined
  }

  if (value === true || Number(value) >= 1 || _.lowerCase(value) === 'true') {
    return true
  }

  return false
}

