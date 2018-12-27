var expect = require('expect')
var {isRealString} = require('./validation')

describe('isRealString',()=>{
  it('should validate that string entered is correct ',()=>{
    var str = "ujjwal"
    var res = isRealString(str)
    expect(res).toBe(true)
    str = ''
    res = isRealString(str)
    expect(res).toBe(false)

  })
})