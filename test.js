let fs = require('fs')
let cords_full = fs.readFileSync('./assets/cords_full.json', 'utf8')
let dataset = JSON.parse(cords_full)


test('dataset include objects', () => {
  expect(typeof dataset[0]).toBe('object')
})

test('coordinate include key "longitude" ', () => {
  expect(dataset[0].location.lng).toBeTruthy()
})

test('key "longitude" is type of number', () => {
  expect(typeof dataset[0].location.lng).toBe('number')
})

test('coordinate include key "latitude" ', () => {
  expect(dataset[0].location.lng).toBeTruthy()
})

test('key "latitude" is type of number', () => {
  expect(typeof dataset[0].location.lat).toBe('number')
})

test('coordinate include key "timestamp"', () => {
  expect(typeof dataset[0].timestamp).toBeTruthy()
})

test('key "timestamp" is type of number', () => {
  expect(typeof dataset[0].timestamp).toBe('number')
})

test('key "timestamp" is type of number', () => {
  expect(typeof dataset[0].timestamp).toBe('number')
})

