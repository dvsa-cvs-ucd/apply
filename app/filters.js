//
// For guidance on how to create filters see:
// https://prototype-kit.service.gov.uk/docs/filters
//

const govukPrototypeKit = require('govuk-prototype-kit')
const addFilter = govukPrototypeKit.views.addFilter

// Add your filters here

addFilter('radiosFromObject', (object, preselect) => Object.keys(object).map(key => ({ text: key, value: key, checked: preselect === key })))
addFilter('formsToRadio', list => list.map(item => ({ text: item.form, value: item.form })))
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
      vehicle = 'Cars or passenger vehicles (up to 8 seats)'
      break
    case 'M2':
    case 'M3':
      vehicle = 'Public service vehicles (PSV), such as coaches or buses'
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
      vehicle = 'Light goods vehicles (LGV) or vans (less than 3,500kg)'
      break
    case 'N2':
    case 'N3':
      vehicle = 'Heavy goods vehicle (HGV) or lorries (more than 3,500kg)'
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

function replaceProductCodeComponent(string) {
  let replacement = string
  switch (string) {
    case 'AN':
      replacement = 'any'
      break
    case 'NH':
      replacement = 'in normal hours'
      break
    case 'OH':
      replacement = 'out of hours'
      break
    case 'AT':
      replacement = 'at an authorised testing facility'
      break
    case 'GV':
      replacement = 'at a DVSA test station'
      break
  }
  return replacement
}

addFilter('productCode', string => string.split('-').map(component => replaceProductCodeComponent(component)).slice(1, 3).join(', '))

addFilter('split', (string, delimiter) => string.split(delimiter ?? '').filter(item => item !== ''))

addFilter('endSegment', string => string.split('/').pop())

addFilter('statusClass', string => {
  let tag = 'govuk-tag--';
  switch (string) {
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

addFilter('tagCodes', array => {
  const codes = array.map(item =>
    item.includes('???') ?
      `<strong class="govuk-tag govuk-tag--red">${item}</strong>` :
      item.includes('XX-') ?
        `<strong class="govuk-tag govuk-tag--orange">${item}</strong>` :
        `<strong class="govuk-tag govuk-tag--${array.length > 1 ? 'yellow' : 'green'}">${item}</strong>`)
  return codes.join(' ')
})

addFilter('findError', (array, name) => array !== undefined && array.find(error => error.field === name))

addFilter('errorFilter', (object, errors = []) => {
  let toReturn = { ...object }
  const relevantError = errors.find(error => error.href.replace('#', '') === object.name)
  if (relevantError) toReturn.errorMessage = { text: relevantError.text }
  return (toReturn)
})

addFilter('axleOptionCounter', vehicle => {
  const minMax = [0, 0]
  switch (vehicle) {
    case 'Heavy goods vehicle (HGV) or lorries (more than 3,500kg)':
      minMax[0] = 2
      minMax[1] = 5
      break
    case 'Public service vehicles (PSV), such as coaches or buses':
      minMax[0] = 2
      minMax[1] = 3
      break
    case 'Light goods vehicles (LGV) or vans (less than 3,500kg)':
    case 'Cars or passenger vehicles (up to 8 seats)':
    case 'Motorcycles, 3-wheeled vehicles and quadricycles':
      minMax[0] = 2
      minMax[1] = 3
      break
    case 'Trailers':
    default:
      minMax[0] = 1
      minMax[1] = 5
      break
  }
  const radios = Array((minMax[1] - minMax[0]) + 1).fill(0).map((val, index) => {
    const radio = {}
    radio['text'] = `${index + minMax[0]} axle${index + minMax[0] === 1 ? '' : 's'}`
    radio['value'] = index + minMax[0]
    return radio
  })
  return radios
})

addFilter('limitTo', (array, number) => array.slice(0, number))

addFilter('date', string => {
  const formatter = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' })
  const date = new Date()
  switch (string) {
    case 'nextWeek':
      date.setDate(date.getDate() + 7)
      return formatter.format(date)
      break
    case 'fourWeeks':
      date.setDate(date.getDate() + 28)
      return formatter.format(date)
      break
    default:
      return formatter.format(date)
      break
  }
})

addFilter('availabilityTag', string => string === 'Tests available' ? '--green' : string === 'Fully booked' ? '--red' : '--blue')
