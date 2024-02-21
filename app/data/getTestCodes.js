const testTypes = require('./app/data/testTypes.json')
const prices = require('./app/data/prices.json')

let testsAndCodes = []

for (let test of testTypes) {
  let newTest = {}
  if (test.testCodes) {
    newTest = { name: test.testTypeName, codes: test.testCodes.map(code => code.defaultTestCode)}
  } else if (test.nextTestTypesOrCategories) {
    for (let nextTest of test.nextTestTypesOrCategories) {
      if (nextTest.testCodes) {
        newTest = { name: nextTest.testTypeName, codes: nextTest.testCodes.map(code => code.defaultTestCode)}
      } else if (nextTest.nextTestTypesOrCategories) {
        for (let nextNextTest of nextTest.nextTestTypesOrCategories) {
          if (nextNextTest.testCodes) {
            newTest = { name: nextNextTest.testTypeName, codes: nextNextTest.testCodes.map(code => code.defaultTestCode)}
            if (Object.keys(newTest).length > 0) testsAndCodes.push(newTest)
          }
        }
      }
    }
    if (Object.keys(newTest).length > 0) testsAndCodes.push(newTest)
  }
  if (Object.keys(newTest).length > 0) testsAndCodes.push(newTest)
}


let allTests = []

for (let test of testsAndCodes) {
  for (let code of test.codes) {
    allTests.push({code: code.toUpperCase(), name : test.name})
  }
}

allTests = allTests.map(test => {
  const foundPrice = prices.find(price => price.code === test.code)
  const price = foundPrice ? foundPrice.price : '£27.00'
  return ({...test, price: price})
})

const fs = require('fs')

const file = fs.writeFileSync('./testCodes.json', JSON.stringify(allTests))


