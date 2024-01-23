//
// For guidance on how to create filters see:
// https://prototype-kit.service.gov.uk/docs/filters
//

const govukPrototypeKit = require('govuk-prototype-kit')
const addFilter = govukPrototypeKit.views.addFilter

// Add your filters here

addFilter('radiosFromObject', (object, preselect) => Object.keys(object).map(key => ({text: key, value: key, checked: preselect === key})))
addFilter('radiosFromList', (list, preselect) => list.map(key => ({text: key, value: key, checked: preselect === key})))

addFilter('findTestUrl', (string, testInventory) => {
  let url;
  Object.keys(testInventory).forEach(vehicle => {
    Object.keys(testInventory[vehicle]).forEach(test => {
      if (test === string) {
        url = testInventory[vehicle][test]
      }
    })
  })
  return url
})

addFilter('vrm', string => {
    const plateRegex = /^[A-Z]{2}\d{2}[A-Z]{3}$/;
    if (!plateRegex.test(string)) {
      return string;
    }
    const formattedPlate = string.replace(/(\d{2})([A-Z]{3})/, '$1 $2');
    return formattedPlate;
})

addFilter('typeApproval', string => {
  let vehicle
  switch (string) {
    case 'M1':
      vehicle = 'Passenger Cars'
      break
    case 'M2':
    case 'M3':
      vehicle = 'PSV - Buses and Coaches'
      break
    case 'L1':
    case 'L2':
    case 'L3':
    case 'L4':
    case 'L5':
    case 'L6':
    case 'L7':
      vehicle = 'Motorcycles and Three Wheeled Vehicles'
      break
    case 'N1':
      vehicle = 'Light Goods Vehicles'
      break
    case 'N2':
    case 'N3':
      vehicle = 'HGV - Lorries or Large Goods Vehicles'
      break
    case 'O1':
    case 'O2':
    case 'O3':
    case 'O4':
      vehicle = 'Trailers'
      break
    default:
      vehicle = 'Unknown'
  }
    return vehicle
})

addFilter('split', (string , delimiter) =>  string.split(delimiter ?? '').filter(item => item !== ''))

addFilter('endSegment', string => string.split('/').pop())

addFilter('statusClass', string => {
  let tag = 'govuk-tag--';
  switch(string) {
    case 'submitted':
    default:
      tag += 'grey'
      break
    case 'accepted':
     tag += 'blue'
     break
    case 'rejected':
      tag += 'red'
      break
    case 'on hold':
      tag += 'yellow'
      break
  }
  return tag
})
