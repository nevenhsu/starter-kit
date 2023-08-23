// template
import { assert } from 'chai'

console.log('NODE_ENV', process.env.NODE_ENV)

describe('Array', () => {
  describe('#indexOf()', () => {
    it('should return -1 when the value is not present', () => {
      assert.equal([1, 2, 3].indexOf(4), -1)
    })
  })
})
