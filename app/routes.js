//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

const parsePhoneNumber = require('libphonenumber-js')


const tass = require('./data/tass.json')

vesKey = process.env.VES_API_KEY

router.get('/start', (req, res) => res.redirect('/'))

router.get('/no-pfa', (req, res) => {
  req.session.data.pfa = false
  req.session.data.myvt = true
  res.redirect('/myvt')
})

router.get('/pfa', (req, res) => {
  req.session.data.pfa = true
  req.session.data.myvt = true
  res.redirect('/myvt')
})

router.get

router.get('/unauthenticated', (req, res) => res.redirect('/'))

router.get(['/apply-for-a-vehicle-test'], (req, res) => {
  req.session.data.myvt = true
  res.redirect('/apply-for-a-vehicle-test/apply/vehicle-details')
})

router.get(['/apply-for-a-vehicle-test/*'], (req, res) => {
  res.render('apply-for-a-vehicle-test/apply.html', {path : req.path, query: req.query})
})

router.get('/what-is-your-name', (req, res) => res.render('what-is-your-name.html', {query: req.query}))
router.get('/name-check', (req, res) => {
  let errorPresent = false
  let errors = []
  if (req.session.data['first-name'].length === 0) {
    errorPresent = true
    errors.push({href: '#first-name', text: 'Enter your first name'})
  }
  if (req.session.data['last-name'].length === 0) {
    errorPresent = true
    errors.push({href: '#last-name', text: 'Enter your last name'})
  }
  if (errorPresent) {
    res.render('what-is-your-name.html', {query: req.query, errors})
  } else {
    res.redirect('/what-is-your-email-address')
  }
})

router.get('/what-is-your-email-address', (req, res) => res.render('what-is-your-email-address.html', {query: req.query}))
router.get('/email-check', (req, res) => {
  let errorPresent = false
  let errors = []
  if (req.session.data['email'].length === 0) {
    errorPresent = true
    errors.push({ href: '#email', text: 'Enter your email address' })
  }
  if (req.session.data['confirm-email'].length === 0) {
    errorPresent = true
    errors.push({ href: '#confirm-email', text: 'Confirm your email address' })
  }
  if (req.session.data['email'].trim() !== req.session.data['confirm-email'].trim() && !errorPresent) {
    errorPresent = true
    errors.push({ href: '#confirm-email', text: 'The email addresses must match' })
  }
  if (req.session.data['email'].match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/) === null && !errorPresent) {
    errorPresent = true
    errors.push({ href: '#email', text: 'Enter an email address in the correct format, like name@example.com'})
  }
  if (errorPresent) {
    res.render('what-is-your-email-address.html', { query: req.query, errors })
  } else {
    res.redirect('/what-is-your-phone-number')
  }
})

router.get('/what-is-your-phone-number', (req, res) => res.render('what-is-your-phone-number.html', {query: req.query}))
router.get('/phone-number-check', (req, res) => {
  let errorPresent = false
  let errors = []
  const phoneNumber = parsePhoneNumber(req.session.data['telephone-number'], 'GB')
  if (req.session.data['telephone-number'].length === 0) {
    errorPresent = true
    errors.push({ href: '#telephone-number', text: 'Enter your telephone number' })
  }
  if (req.session.data['confirm-telephone-number'].length === 0) {
    errorPresent = true
    errors.push({ href: '#confirm-telephone-number', text: 'Confirm your telephone number' })
  }
  if (req.session.data['telephone-number'].trim() !== req.session.data['confirm-telephone-number'].trim() && !errorPresent) {
    errorPresent = true
    errors.push({ href: '#confirm-telephone-number', text: 'The telephone numbers must match' })
  }
  if (phoneNumber !== undefined &&!phoneNumber.isValid() && !errorPresent)  {
    errorPresent = true
    errors.push({ href: '#telephone-number', text: 'Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 808 157 0192' })
  }
  if (errorPresent) {
    res.render('what-is-your-phone-number.html', { query: req.query, errors })
  } else {
    res.redirect('/vehicle-details')
  }
})
router.get('/vehicle-details', (req, res) => res.render('vehicle-details.html', {query: req.query}))
router.get('/vin-check', (req, res) => {
  let errorPresent = false
  let errors = []
  if (req.session.data.vin.length < 8) {
    errorPresent = true
    errors.push({ href: '#vin', text: 'Enter a VIN with the correct number of characters. Most vehicles registered after 1980 should have a 17 character VIN. Vehicles registered earlier or imported should have a 8 or 21 character VIN.' })
  }
  if (req.session.data.vin.length > 0 && !(/^[a-zA-Z0-9 \u2013\u2014\u2212\-]+$/).test(req.session.data.vin)) {
    errorPresent = true
    errors.push({ href: '#vin', text: 'A vehicle identification number must only include the letters a to z or numbers.' })
  }
  if (req.session.data.vrm.length > 0 && !(/^[a-zA-Z0-9 \u2013\u2014\u2212\-]+$/).test(req.session.data.vrm)) {
    errorPresent = true
    errors.push({ href: '#vrm', text: 'A vehicle registration mark must only include the letters a to z or numbers.' })
  }
  if (errorPresent) {
    if (req.session.data.myvt) {
      res.render('apply-for-a-vehicle-test/apply.html', { path: '/apply-for-a-vehicle-test/apply/vehicle-details', query: req.query, errors })
    } else {
      res.render('vehicle-details.html', { query: req.query, errors })
    }
  } else {
    res.redirect('/vrm-check')
  }
})

router.get('/vehicle-data', (req, res) => res.render('vehicle-data.html', {query: req.query}))

router.get('/vehicle-category', (req, res) => res.render('vehicle-category.html', {query: req.query}))
router.get('/vehicle-category-check', (req, res) => {
  let errorPresent = false
  let errors = []
  if (req.session.data['vehicle-category'] === undefined) {
    errorPresent = true
    errors.push({ href: '#vehicle-category', text: 'Select a vehicle category'})
  }
  if (errorPresent) {
    if (req.session.data.myvt) {
      res.render('apply-for-a-vehicle-test/apply.html', { path: '/apply-for-a-vehicle-test/apply/vehicle-category', query: req.query, errors })
    } else {
      res.render('vehicle-category.html', { query: req.query, errors })
    }
  } else {
    const myvt = req.session.data['myvt'] ? '/apply-for-a-vehicle-test/apply' : ''
    switch (req.session.data['vehicle-category']) {
      case 'Light goods vehicles (LGV) or vans (less than 3,500kg)':
        req.session.data.unece = 'N1'
        res.redirect(`${myvt}/vehicle-class`)
        break
      case 'Cars or passenger vehicles (up to 8 seats)':
        req.session.data.unece = 'M1'
        res.redirect(`${myvt}/vehicle-class`)
        break
      default:
        res.redirect(`${myvt}/unece-category`)
        break
    }
  }
})

router.get('/number-of-axles', (req, res) => res.render('number-of-axles.html'))
router.get('/number-of-axles-check', (req, res) => {
  let errorPresent = false
  let errors = []
  if (req.session.data['axles'] === undefined) {
    errorPresent = true
    errors.push({ href: '#axles', text: 'Select the number of axles' })
  }
  if (errorPresent) {
    if (req.session.data.myvt) {
      res.render('apply-for-a-vehicle-test/apply.html', { path: '/apply-for-a-vehicle-test/apply/number-of-axles', query: req.query, errors })
    } else {
      res.render('number-of-axles.html', { query: req.query, errors })
    }
  } else {
    const myvt = req.session.data['myvt'] ? '/apply-for-a-vehicle-test/apply' : ''
    switch (req.session.data['vehicle-category']) {
      case 'Heavy goods vehicle (HGV) or lorries (more than 3,500kg)':
      case 'Public service vehicles (PSV), such as coaches or buses':
      case 'Trailers':
        res.redirect(`${myvt}/vehicle-configuration`)
        break
      case 'Motorcycles, 3-wheeled vehicles and quadricycles':
        req.session.data['test-type'] = 'Motorcycle Single Vehicle Approval'
        res.redirect(`${myvt}/application-type`)
        break
      default:
        res.redirect(`${myvt}/test-type`)
        break
    }
  }
})

router.get('/unece-category', (req, res) => res.render('unece-category.html', { query: req.query }))
router.get('/unece-category-check', (req, res) => {
  let errorPresent = false
  let errors = []
  if (req.session.data.unece === undefined) {
    errorPresent = true
    errors.push({ href: '#unece', text: 'Select an UNECE vehicle category' })
  }
  if (errorPresent) {
    if (req.session.data.myvt) {
      res.render('apply-for-a-vehicle-test/apply.html', { path: '/apply-for-a-vehicle-test/apply/unece-category', query: req.query, errors })
    } else {
      res.render('unece-category.html', { query: req.query, errors })
    }
  } else {
    const myvt = req.session.data['myvt'] ? '/apply-for-a-vehicle-test/apply' : ''
    res.redirect(`${myvt}/number-of-axles`)
  }
})

router.get('/vehicle-configuration', (req, res) => res.render('vehicle-configuration.html', { query: req.query }))
router.get('/vehicle-configuration-check', (req, res) => {
  let errorPresent = false
  let errors = []
  if (req.session.data['vehicle-configuration'] === undefined) {
    errorPresent = true
    errors.push({ href: '#vehicle-configuration', text: 'Select a vehicle configuration' })
  }
  if (errorPresent) {
    if (req.session.data.myvt) {
      res.render('apply-for-a-vehicle-test/apply.html', { path: '/apply-for-a-vehicle-test/apply/vehicle-configuration', query: req.query, errors })
    } else {
      res.render('vehicle-configuration.html', { query: req.query, errors })
    }
  } else {
    const myvt = req.session.data['myvt'] ? '/apply-for-a-vehicle-test/apply' : ''
    res.redirect(`${myvt}/test-type`)
  }
})

router.get('/vehicle-class', (req, res) => res.render('vehicle-class.html', { query: req.query }))
router.get('/vehicle-class-check', (req, res) => {
  let errorPresent = false
  let errors = []
  if (req.session.data['vehicle-class'] === undefined) {
    errorPresent = true
    errors.push({ href: '#vehicle-class', text: 'Select a vehicle class' })
  }
  if (req.session.data['vehicle-category'] === 'Cars or passenger vehicles (up to 8 seats)' && req.session.data.wav === undefined) {
    errorPresent = true
    errors.push({ href: '#wav', text: 'Select an  Wheelchair Accessible Vehicle option' })
  }
  if (errorPresent) {
    if (req.session.data.myvt) {
      res.render('apply-for-a-vehicle-test/apply.html', { path: '/apply-for-a-vehicle-test/apply/vehicle-class', query: req.query, errors })
    } else {
      res.render('vehicle-class.html', { query: req.query, errors })
    }
  } else {
    const myvt = req.session.data['myvt'] ? '/apply-for-a-vehicle-test/apply' : ''
    res.redirect(`${myvt}/number-of-axles`)
  }
})

router.get('/test-type', (req, res) => res.render('test-type.html'))
router.get('/test-type-check', (req, res) => {
  let errorPresent = false
  let errors = []
  if (req.session.data['test-type'] === undefined) {
    errorPresent = true
    errors.push({ href: '#test-type', text: 'Select a technical test' })
  }
  if (errorPresent) {
    if (req.session.data.myvt) {
      res.render('apply-for-a-vehicle-test/apply.html', { path : '/apply-for-a-vehicle-test/apply/test-type', query: req.query, errors})
    } else {
      res.render('test-type.html', { query: req.query, errors })
    }
  } else {
    const myvt = req.session.data['myvt'] ? '/apply-for-a-vehicle-test/apply' : ''
    res.redirect(`${myvt}/application-type`)
  }
})

router.get('/application-type', (req, res) => res.render('application-type.html', {query: req.query}))
router.get('/application-type-check', (req, res) => {
  let errorPresent = false
  let errors = []
  if (req.session.data['application-type'] === undefined) {
    errorPresent = true
    errors.push({ href: '#application-type', text: 'Select an application type' })
  }
  if (errorPresent) {
    if (req.session.data.myvt) {
      res.render('apply-for-a-vehicle-test/apply.html', { path: '/apply-for-a-vehicle-test/apply/application-type', query: req.query, errors })
    } else {
      res.render('application-type.html', { query: req.query, errors })
    }
  } else {
    const myvt = req.session.data['myvt'] ? '/apply-for-a-vehicle-test/apply' : ''
    res.redirect(`${myvt}/upload-form`)
  }
})

router.get('/test-location', (req, res) => res.render('test-location.html', {query: req.query}))
router.get('/test-location-check', (req, res) => {
  if (req.query.find === 'find')  {
    let errorPresent = false
    let errors = []
    if (req.session.data['find-test-centre'] === '') {
      errorPresent = true
      errors.push({ href: '#find-test-centre', text: 'Enter a location or a postcode' })
    }
    if (errorPresent) {
      if (req.session.data.myvt) {
        res.render('apply-for-a-vehicle-test/apply.html', { path: '/apply-for-a-vehicle-test/apply/test-location', query: req.query, errors })
      } else {
        res.render('test-location.html', { query: req.query, errors })
      }
    } else {
      const myvt = req.session.data['myvt'] ? '/apply-for-a-vehicle-test/apply' : ''
      res.redirect(`${myvt}/test-location-list`)
    }
  } else {
    req.session.data.testCentre = req.session.data['select-test-centre']
    res.redirect('/submit-test')
  }
})

router.get('/download-form', (req, res) => {
  const formToDownload = req.query['test-type'] ?? req.session.data['test-type']
  if (formToDownload !== undefined) {
    res.render('download-form')
  } else {
    res.redirect('/vehicle-category')
  }
})

router.get('/vrm-check', async (req, res) => {
  // const reg = { registrationNumber: req.session.data.vrm }
  // const response = await fetch('https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles', {
  //   method: 'POST',
  //   headers: {
  //     'x-api-key': vesKey,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(reg)
  // })
  // req.session.data.vehicle = await response.json()
  const myvt = req.session.data['myvt'] ? '/apply-for-a-vehicle-test/apply' : ''
  res.redirect(`${myvt}/vehicle-category`)
  // if (response.status === 200) {
  //   res.redirect(`${myvt}/vehicle-data`)
  // } else {
  //   res.redirect(`${myvt}/vehicle-category`)
  // }
})

router.get('/change-vehicle', (req, res) => {
  currentVehicle = req.session.data.vehicles[req.session.data['changing']]
  currentVehicle.vin = req.session.data['vin']
  currentVehicle.vrm = req.session.data['vrm']
  req.session.data.changedVehicle = true
  const myvt = req.session.data['myvt'] ? '/apply-for-a-vehicle-test/apply' : ''
  res.redirect(`${myvt}/check-your-answers`)
})

router.get('/upload-form', (req, res) => res.render('/upload-form', {query: req.query}))
router.get('/upload-supporting-documentation', (req, res) => res.render('/upload-supporting-documentation', {query: req.query}))

router.get(['/upload-check'], (req, res) => {
  req.session.data.removed = undefined
  req.session.data.uploaded = undefined
  const myvt = req.session.data['myvt'] ? '/apply-for-a-vehicle-test/apply' : ''
  if (req.query.continue) {
    res.redirect(`${myvt}/test-location`)
  } else {
    if (req.query['upload-multiple'] !== undefined && req.query['supporting-documentation-upload'].length !== 0) {
      req.session.data.error = false
      if (req.session.data['supporting-documentation'] === undefined) req.session.data['supporting-documentation'] = []
      req.session.data['supporting-documentation'] = req.session.data['supporting-documentation'].concat(req.session.data['supporting-documentation-upload'])
      res.redirect(`${myvt}/upload-supporting-documentation?uploaded=1`)
    } else {
      req.session.data.error = true
      res.redirect(`${myvt}/upload-supporting-documentation`)
    }
  }
})

router.get(['/remove-file'], (req, res) => {
  const myvt = req.session.data['myvt'] ? '/apply-for-a-vehicle-test/apply' : ''
  const indexToRemove = req.session.data['supporting-documentation'].indexOf(req.query.filename)
  req.session.data['supporting-documentation'].splice(indexToRemove, 1)
  req.session.data.removed = req.query.filename
  res.redirect(`${myvt}/upload-supporting-documentation`)
})

router.get(['/submit-test'], (req, res) => {
  const myvt = req.session.data['myvt'] ? '/apply-for-a-vehicle-test/apply' : ''
  const currentFields = req.session.data
  const currentVehicle = currentFields.vehicles.find(vehicle => currentFields['vin'] === vehicle.vin)
  const pcEndings = tass[currentFields['vehicle-category']][currentFields['test-type']].find(test => test.form === currentFields['application-type']).codes
  const prefix = currentFields['application-type'].includes('Annual Test') ? 'XX' : 'AN'
  const potentialPcs = pcEndings.map(ending => `${prefix}-${currentFields['test-time']}-${currentFields['test-location']}-${ending}`)
  if (currentVehicle) {
    const currentTest = currentVehicle.tests.find(test => test['test'] === currentFields['application-type'])

    if (req.session.data.changedVehicle) {
      req.session.data.changedVehicle = false 
    } else {
      if (currentTest) {
        currentTest['form'] = currentFields['application-upload'],
        currentTest['supporting'] = currentFields['supporting-documentation']
      } else {
        currentVehicle.tests.push({ 
          test: currentFields['application-type'], 
          form: currentFields['application-upload'], 
          productCodes: potentialPcs,
          location: currentFields['test-location'],
          testCentre: currentFields.testCentre,
          time: currentFields['test-time'], 
          supporting: currentFields['supporting-documentation']
        })
      }
    }
  } else {
    currentFields.vehicles.push({
      vin: currentFields['vin'],
      vrm: currentFields['vrm'],
      category: currentFields['vehicle-category'],
      tests: [
        {
          test: currentFields['application-type'], 
          form: currentFields['application-upload'],
          productCodes: potentialPcs,
          testCentre: currentFields.testCentre,
          location: currentFields['test-location'],
          time: currentFields['test-time'], 
          supporting: currentFields['supporting-documentation']
        }
        ]
    })
  }
  res.redirect(`${myvt}/check-your-answers`)
})

router.get('/check-your-answers', (req, res) => { 
  res.render('/check-your-answers.html', {query: req.query})
})

router.get('/add-vehicle', (req, res) => {
  const myvt = req.session.data['myvt'] ? '/apply-for-a-vehicle-test/apply' : ''
  req.session.data.vin = undefined
  req.session.data.vrm = undefined
  req.session.data['vehicle-category'] = undefined
  req.session.data['vehicle-class'] = undefined
  req.session.data.wav = undefined
  req.session.data.axles = undefined
  req.session.data.unece = undefined
  req.session.data['test-type'] = undefined
  req.session.data['application-type'] = undefined
  req.session.data['upload-form'] = undefined
  req.session.data['supporting-documentation'] = undefined
  res.redirect(`${myvt}/vehicle-details`)
})

router.get('/add-test', (req, res) => {
  const myvt = req.session.data['myvt'] ? '/apply-for-a-vehicle-test/apply' : ''
  req.session.data['vehicle-category'] = req.session.data.vehicles[req.session.data.addTo]['category']
  req.session.data.vin = req.session.data.vehicles[req.session.data.addTo].vin
  req.session.data.vrm = req.session.data.vehicles[req.session.data.addTo].vrm
  req.session.data['test-type'] = undefined
  req.session.data['application-type'] = undefined
  req.session.data['application-upload'] = undefined
  req.session.data['supporting-documentation'] = undefined
  res.redirect(`${myvt}/test-type`)
})
