//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

const parsePhoneNumber = require('libphonenumber-js')


const tass = require('./data/tass.json')

vesKey = process.env.VES_API_KEY

const msvaRoutes = {
  L1: 'is-the-vehicle-a-low-powered-moped',
  L2: 'is-the-vehicle-a-low-powered-moped',
  L3: 'select-the-engine-capacity',
  L4: 'select-the-vehicle-weight',
  L5: 'select-the-vehicle-weight',
  L6: 'select-the-vehicle-style',
  L7: 'select-the-vehicle-style'
}

const notMopedOptions = {
  L1: 'test-type',
  L2: 'select-the-vehicle-weight'
}

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
  req.session.myvt = true
  res.render('apply-for-a-vehicle-test/apply.html', { path: req.path, query: req.query })
})

router.get('/what-is-your-name', (req, res) => res.render('what-is-your-name.html', { query: req.query }))
router.get('/name-check', (req, res) => {
  let errorPresent = false
  let errors = []
  if (req.session.data['first-name'].length === 0) {
    errorPresent = true
    errors.push({ href: '#first-name', text: 'Enter your first name' })
  }
  if (req.session.data['first-name'].length > 50) {
    errorPresent = true
    errors.push({ href: '#first-name', text: 'First name must be 50  characters or less' })
  }
  if (req.session.data['first-name'].length !== 0 && !(/^[a-zA-ZÀ-ÿ\s'-]+$/u).test(req.session.data['first-name'])) {
    errorPresent = true
    errors.push({ href: '#first-name', text: 'First name must only include letters, and the characters space, apostrophe, hyphen, full stop or comma' })
  }
  if (req.session.data['last-name'].length === 0) {
    errorPresent = true
    errors.push({ href: '#last-name', text: 'Enter your last name' })
  }
  if (req.session.data['last-name'].length > 50) {
    errorPresent = true
    errors.push({ href: '#last-name', text: 'Last name must be 50  characters or less' })
  }
  if (req.session.data['last-name'].length !== 0 && !(/^[a-zA-ZÀ-ÿ\s'-]+$/u).test(req.session.data['last-name'])) {
    errorPresent = true
    errors.push({ href: '#last-name', text: 'Last name must only include letters, and the characters space, apostrophe, hyphen, full stop or comma' })
  }
  if (req.session.data['company-name'].length > 160) {
    errorPresent = true
    errors.push({ href: '#company-name', text: 'Company name must be 160 characters or less' })
  }
  if (errorPresent) {
    res.render('what-is-your-name.html', { query: req.query, errors })
  } else {
    res.redirect('/what-is-your-address')
  }
})

router.get('/what-is-your-address', (req, res) => res.render('what-is-your-address.html', { query: req.query }))
router.get('/address-check', (req, res) => {
  let errorPresent = false
  let errors = []
  if (req.session.data['address-line-1'].length === 0) {
    errorPresent = true
    errors.push({href: '#address-line-1', text: 'Enter the first line of your address, typically the building and street'})
  }
  if (req.session.data['address-line-1'].length !== 0 && !(/^[0-9a-zA-ZÀ-ÿ\s'-\.]+$/u).test(req.session.data['address-line-1'])) {
    errorPresent = true
    errors.push({ href: '#address-line-1', text: 'Address line 1 must  only include letters and numbers, and the characters space,  apostrophe hyphen or full stop' })
  }
  if (req.session.data['address-line-1'].length > 100) {
    errorPresent = true
    errors.push({href: '#address-line-1', text: 'Address line 1 must be 100 characters or less'})
  }
  if (req.session.data['address-line-2'].length > 50) {
    errorPresent = true
    errors.push({href: '#address-line-2', text: 'Address line 2 must be 50 characters or less'})
  }
  if (req.session.data['address-town'].length === 0) {
    errorPresent = true
    errors.push({ href: '#address-town', text: 'Enter the town or city of your address' })
  }
  if (req.session.data['address-town'].length !== 0 && !(/^[a-zA-ZÀ-ÿ\s'-\.]+$/u).test(req.session.data['address-town'])) {
    errorPresent = true
    errors.push({ href: '#address-town', text: 'Town or city must only include letters and numbers, and the characters space,  apostrophe hyphen or full stop' })
  }
  if (req.session.data['address-town'].length > 30) {
    errorPresent = true
    errors.push({ href: '#address-town', text: 'Town or city must be 30 characters or less' })
  }
  if (req.session.data['address-county'].length > 30) {
    errorPresent = true
    errors.push({ href: '#address-county', text: 'County must be  30 characters or less' })
  }
  if (req.session.data['address-postcode'].length === 0) {
    errorPresent = true
    errors.push({ href: '#address-postcode', text: 'Enter the postcode of your address' })
  }
  if (req.session.data['address-postcode'].length > 20) {
    errorPresent = true
    errors.push({ href: '#address-postcode', text: 'Postcode must  be 20 characters or less' })
  }
  if (req.session.data['address-postcode'].length !== 0 && !(/^[a-zA-Z0-9\s]+$/u).test(req.session.data['address-postcode'])) {
    errorPresent = true
    errors.push({ href: '#address-postcode', text: 'Postcode must  only include letters and numbers, and the space character' })
  }
  if (req.session.data['address-country']) {
    if (req.session.data['address-country'][1] === 'country:GB' && req.session.data['address-postcode'].length > 0) {
      if (!(/^([A-Z][A-HJ-Y]?\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0A{2})$/).test(req.session)) {
        errorPresent = true
        errors.push({ href: '#address-postcode', text: 'Enter a full UK postcode, like LS9 6NF, BT12 6QL, or SA1 8AN'})
      }
    }
  }
  if (req.session.data['address-country'].length === 0) {
    errorPresent = true
    errors.push({ href: '#address-country', text: 'Enter the country of your address'})
  } 
  if (errorPresent) {
    res.render('what-is-your-address.html', { query: req.query, errors })
  } else {
    res.redirect('/what-is-your-email-address')
  }
})

router.get('/what-is-your-email-address', (req, res) => res.render('what-is-your-email-address.html', { query: req.query }))
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
    errors.push({ href: '#email', text: 'Enter an email address in the correct format, like name@example.com' })
  }
  if (errorPresent) {
    res.render('what-is-your-email-address.html', { query: req.query, errors })
  } else {
    res.redirect('/check-your-email')
  }
})

router.get('/what-is-your-phone-number', (req, res) => res.render('what-is-your-phone-number.html', { query: req.query }))
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
  if (phoneNumber !== undefined && !phoneNumber.isValid() && !errorPresent) {
    errorPresent = true
    errors.push({ href: '#telephone-number', text: 'Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 808 157 0192' })
  }
  if (errorPresent) {
    res.render('what-is-your-phone-number.html', { query: req.query, errors })
  } else {
    res.redirect('/check-your-phone')
  }
})
router.get('/vehicle-details', (req, res) => res.render('vehicle-details.html', { query: req.query }))
router.get('/vin-check', (req, res) => {
  let errorPresent = false
  let errors = []
  if (req.session.data.vin.length < 8) {
    errorPresent = true
    errors.push({ href: '#vin', text: 'Enter a VIN with the correct number of characters. Most vehicles registered after 1980 should have a 17 character VIN. Vehicles registered earlier or imported should have a 8 or 21 character VIN' })
  }
  if (req.session.data.vin.length > 0 && !(/^[a-zA-Z0-9 \u2013\u2014\u2212\-]+$/).test(req.session.data.vin)) {
    errorPresent = true
    errors.push({ href: '#vin', text: 'A vehicle identification number must only include the letters a to z or numbers' })
  }
  if (req.session.data.vrm.length > 0 && !(/^[a-zA-Z0-9 \u2013\u2014\u2212\-]+$/).test(req.session.data.vrm)) {
    errorPresent = true
    errors.push({ href: '#vrm', text: 'A vehicle registration mark must only include the letters a to z or numbers' })
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

router.get('/vehicle-data', (req, res) => res.render('vehicle-data.html', { query: req.query }))

router.get('/vehicle-category', (req, res) => res.render('vehicle-category.html', { query: req.query }))
router.get('/vehicle-category-check', (req, res) => {
  let errorPresent = false
  let errors = []
  if (req.session.data['vehicle-category'] === undefined) {
    errorPresent = true
    errors.push({ href: '#vehicle-category', text: 'Select a vehicle category' })
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
        req.session.data.axles = 2
        res.redirect(`${myvt}/vehicle-class`)
        break
      case 'Cars or passenger vehicles (up to 8 seats)':
        req.session.data.unece = 'M1'
        req.session.data.axles = 2
        res.redirect(`${myvt}/vehicle-class`)
        break
      case 'Motorcycles, 3-wheeled vehicles and quadricycles':
        res.redirect(`${myvt}/number-of-wheels`)
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

router.get('/number-of-wheels', (req, res) => res.render('number-of-wheels.html'))
router.get('/number-of-wheels-check', (req, res) => {
  let errorPresent = false
  let errors = []
  if (req.session.data['number-of-wheels'] === undefined) {
    errorPresent = true
    errors.push({ href: '#number-of-wheels', text: 'Select the number of wheels' })
  }
  if (errorPresent) {
    if (req.session.data.myvt) {
      res.render('apply-for-a-vehicle-test/apply.html', { path: '/apply-for-a-vehicle-test/apply/number-of-wheels', query: req.query, errors })
    } else {
      res.render('number-of-wheels.html', { query: req.query, errors })
    }
  } else {
    const myvt = req.session.data['myvt'] ? '/apply-for-a-vehicle-test/apply' : ''
    res.redirect(`${myvt}/unece-category`)
  }
})

router.get('/unece-category', (req, res) => res.render('unece-category.html', { query: req.query }))
router.get('/unece-category-check', (req, res) => {
  let errorPresent = false
  let errors = []
  if (req.session.data.unece === undefined) {
    errorPresent = true
    errors.push({ href: '#unece', text: 'Select a design and construction category' })
  }
  if (errorPresent) {
    if (req.session.data.myvt) {
      res.render('apply-for-a-vehicle-test/apply.html', { path: '/apply-for-a-vehicle-test/apply/unece-category', query: req.query, errors })
    } else {
      res.render('unece-category.html', { query: req.query, errors })
    }
  } else {
    const myvt = req.session.data['myvt'] ? '/apply-for-a-vehicle-test/apply' : ''
    switch (req.session.data['vehicle-category']) {
      case 'Motorcycles, 3-wheeled vehicles and quadricycles':
        req.session.data['test-type'] = 'Motorcycle Single Vehicle Approval'
        res.redirect(`${myvt}/${msvaRoutes[req.session.data.unece]}`)
        break
      case 'Cars or passenger vehicles (up to 8 seats)':
      case 'Light goods vehicles (LGV) or vans (less than 3,500kg)':
        res.redirect(`${myvt}/test-type`)
        break
      default:
        res.redirect(`${myvt}/number-of-axles`)
        break
    }
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
    errors.push({ href: '#wav', text: 'Select a Wheelchair Accessible Vehicle option' })
  }
  if (errorPresent) {
    if (req.session.data.myvt) {
      res.render('apply-for-a-vehicle-test/apply.html', { path: '/apply-for-a-vehicle-test/apply/vehicle-class', query: req.query, errors })
    } else {
      res.render('vehicle-class.html', { query: req.query, errors })
    }
  } else {
    const myvt = req.session.data['myvt'] ? '/apply-for-a-vehicle-test/apply' : ''
    res.redirect(`${myvt}/test-type`)
  }
})

router.get('/is-the-vehicle-a-low-powered-moped', (req, res) => res.render('is-the-vehicle-a-low-powered-moped.html', { query: req.query }))
router.get('/low-power-moped-check', (req, res) => {
  let errorPresent = false
  let errors = []
  if (req.session.data['low-power-moped'] === undefined) {
    errorPresent = true
    errors.push({ href: '#low-power-moped', text: 'Select yes if the vehicle is a low-powered moped' })
  }
  if (errorPresent) {
    if (req.session.data.myvt) {
      res.render('apply-for-a-vehicle-test/apply.html', { path: '/apply-for-a-vehicle-test/apply/is-the-vehicle-a-low-powered-moped', query: req.query, errors })
    } else {
      res.render('is-the-vehicle-a-low-powered-moped.html', { query: req.query, errors })
    }
  } else {
    const myvt = req.session.data['myvt'] ? '/apply-for-a-vehicle-test/apply' : ''
    switch (req.session.data['low-power-moped']) {
      case 'yes':
        res.redirect(`${myvt}/test-type`)
        break
      case 'no':
      default:
        res.redirect(`${myvt}/${notMopedOptions[req.session.data.unece]}`)
        break
    }
  }
})

router.get('/select-the-engine-capacity', (req, res) => res.render('select-the-engine-capacity.html', { query: req.query }))
router.get('/engine-capacity-check', (req, res) => {
  let errorPresent = false
  let errors = []
  if (req.session.data['engine-capacity'] === undefined) {
    errorPresent = true
    errors.push({ href: '#engine-capacity', text: 'Select if the engine capacity is 200cc or less or more than 200cc' })
  }
  if (errorPresent) {
    if (req.session.data.myvt) {
      res.render('apply-for-a-vehicle-test/apply.html', { path: '/apply-for-a-vehicle-test/apply/select-the-engine-capacity', query: req.query, errors })
    } else {
      res.render('select-the-engine-capacity.html', { query: req.query, errors })
    }
  } else {
    const myvt = req.session.data['myvt'] ? '/apply-for-a-vehicle-test/apply' : ''
    switch (req.session.data['engine-capacity']) {
      default:
        res.redirect(`${myvt}/test-type`)
        break
    }
  }
})

router.get('/select-the-vehicle-weight', (req, res) => res.render('select-the-vehicle-weight.html', { query: req.query }))
router.get('/vehicle-weight-check', (req, res) => {
  let errorPresent = false
  let errors = []
  if (req.session.data['vehicle-weight'] === undefined) {
    errorPresent = true
    errors.push({ href: '#vehicle-weight', text: 'Select if the weight is 450kg or less or more than 450kg' })
  }
  if (errorPresent) {
    if (req.session.data.myvt) {
      res.render('apply-for-a-vehicle-test/apply.html', { path: '/apply-for-a-vehicle-test/apply/select-the-vehicle-weight', query: req.query, errors })
    } else {
      res.render('select-the-vehicle-weight.html', { query: req.query, errors })
    }
  } else {
    const myvt = req.session.data['myvt'] ? '/apply-for-a-vehicle-test/apply' : ''
    switch (req.session.data['vehicle-weight']) {
      default:
        res.redirect(`${myvt}/select-the-vehicle-style`)
        break
    }
  }
})

router.get('/select-the-vehicle-style', (req, res) => res.render('select-the-vehicle-style.html', { query: req.query }))
router.get('/vehicle-style-check', (req, res) => {
  let errorPresent = false
  let errors = []
  if (req.session.data['vehicle-style'] === undefined) {
    errorPresent = true
    errors.push({ href: '#vehicle-style', text: 'Select if the vehicle is bodied or unbodied' })
  }
  if (errorPresent) {
    if (req.session.data.myvt) {
      res.render('apply-for-a-vehicle-test/apply.html', { path: '/apply-for-a-vehicle-test/apply/select-the-vehicle-style', query: req.query, errors })
    } else {
      res.render('select-the-vehicle-style.html', { query: req.query, errors })
    }
  } else {
    const myvt = req.session.data['myvt'] ? '/apply-for-a-vehicle-test/apply' : ''
    switch (req.session.data['vehicle-style']) {
      default:
        res.redirect(`${myvt}/test-type`)
        break
    }
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
      res.render('apply-for-a-vehicle-test/apply.html', { path: '/apply-for-a-vehicle-test/apply/test-type', query: req.query, errors })
    } else {
      res.render('test-type.html', { query: req.query, errors })
    }
  } else {
    const myvt = req.session.data['myvt'] ? '/apply-for-a-vehicle-test/apply' : ''
    res.redirect(`${myvt}/application-type`)
  }
})

router.get('/vehicle-being-tested-alongside-mot', (req, res) => res.render('vehicle-being-tested-alongside-mot.html'))
router.get('/mot-check', (req, res) => {
  let errorPresent = false
  let errors = []
  if (req.session.data['tested-with-mot'] === undefined) {
    errorPresent = true
    errors.push({ href: '#tested-with-mot', text: 'Select whether your vehicle is being tested with an MOT' })
  }
  if (errorPresent) {
    if (req.session.data.myvt) {
      res.render('apply-for-a-vehicle-test/apply.html', { path: '/apply-for-a-vehicle-test/apply/vehicle-being-tested-alongside-mot', query: req.query, errors })
    } else {
      res.render('vehicle-being-tested-alongside-mot.html', { query: req.query, errors })
    }
  } else {
    const myvt = req.session.data['myvt'] ? '/apply-for-a-vehicle-test/apply' : ''
    res.redirect(`${myvt}/upload-form`)
    // if (req.session.data['tested-with-mot'] === 'yes') {
    //   res.redirect('/submit-test')
    // } else {
    //   res.redirect(`${myvt}/where-are-you-planning-to-take-your-vehicle`)
    // }
  }
})

router.get('/where-are-you-planning-to-take-your-vehicle', (req, res) => res.render('where-are-you-planning-to-take-your-vehicle.html'))
router.get('/taking-vehicle-check', (req, res) => {
  let errorPresent = false
  let errors = []
  if (req.session.data['taking-vehicle'] === undefined) {
    errorPresent = true
    errors.push({ href: '#taking-vehicle', text: 'Select where you are planning to take your vehicle' })
  }
  if (errorPresent) {
    if (req.session.data.myvt) {
      res.render('apply-for-a-vehicle-test/apply.html', { path: '/apply-for-a-vehicle-test/apply/where-are-you-planning-to-take-your-vehicle', query: req.query, errors })
    } else {
      res.render('where-are-you-planning-to-take-your-vehicle.html', { query: req.query, errors })
    }
  } else {
    const myvt = req.session.data['myvt'] ? '/apply-for-a-vehicle-test/apply' : ''
    switch (req.session.data['taking-vehicle']) {
      case 'gvts':
      case 'unknown':
        res.redirect(`${myvt}/test-location`)
        break
      case 'atf':
      case 'potf':
        res.redirect('/submit-test')
        break
    }
  }
})

router.get('/application-type', (req, res) => res.render('application-type.html', { query: req.query }))
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
    switch (req.session.data['application-type']) {
      case 'VTG10 Notifiable Alteration':
      case 'VTG10 Notifiable Alteration with Model Report Only':
        res.redirect(`${myvt}/notifiable-alteration`)
        break
      case 'PSV417 Application for COIF':
      case 'PSVC1 Tempo 100 Application':
      case 'VTP5 Notifiable Alteration':
        res.redirect(`${myvt}/size-of-psv`)
        break
      case 'PSVA1 Application for Accessibility Cert (Non Approved Type)':
      case 'PSVA4 Certification Type Approval Application':
        res.redirect(`${myvt}/dda-schedules`)
        break
      case 'VTP6 Request for Replacement COIF or Test Certificate':
        res.redirect(`${myvt}/vtp6`)
        break
      default:
        res.redirect(`${myvt}/upload-form`)
        break
    }
  }
})

router.get('/notifiable-alteration', (req, res) => res.render('notifiable-alteration.html', { query: req.query }))
router.get('/notifiable-alteration-check', (req, res) => {
  let errorPresent = false
  let errors = []
  if (req.session.data['notifiable-alteration'] === undefined) {
    errors.push({ href: '#notifiable-alteration', text: 'Select if the plated details will change' })
  }
  if (errorPresent) {
    if (req.session.data.myvt) {
      res.render('apply-for-a-vehicle-test/apply.html', { path: '/apply-for-a-vehicle-test/apply/notifiable-alteration', query: req.query, errors })
    } else {
      res.render('notifiable-alteration.html', { query: req.query, errors })
    }
  } else {
    const myvt = req.session.data['myvt'] ? '/apply-for-a-vehicle-test/apply' : ''
    res.redirect(`${myvt}/upload-form`)
  }
})

router.get('/size-of-psv', (req, res) => res.render('size-of-psv.html', { query: req.query }))
router.get('/size-of-psv-check', (req, res) => {
  let errorPresent = false
  let errors = []
  if (req.session.data['size-of-psv'] === undefined) {
    errorPresent = true
    errors.push({ href: '#size-of-psv', text: 'Select if your vehicle has 23 or more seats' })
  }
  if (errorPresent) {
    if (req.session.data.myvt) {
      res.render('apply-for-a-vehicle-test/apply.html', { path: '/apply-for-a-vehicle-test/apply/size-of-psv', query: req.query, errors })
    } else {
      res.render('size-of-psv.html', { query: req.query, errors })
    }
  } else {
    const myvt = req.session.data['myvt'] ? '/apply-for-a-vehicle-test/apply' : ''
    switch (req.session.data['application-type']) {
      case 'PSVC1 Tempo 100 Application':
      case 'VTP5 Notifiable Alteration':
        res.redirect(`${myvt}/upload-form`)
        break
      default:
        res.redirect(`${myvt}/seat-belt-installation`)
        break
    }
  }
})

router.get('/certificate-of-conformity', (req, res) => res.render('certificate-of-conformity.html', { query: req.query }))
router.get('/coc-check', (req, res) => {
  let errorPresent = false
  let errors = []
  if (req.session.data['coc'] === undefined) {
    errorPresent = true
    errors.push({ href: '#coc', text: 'Select if your vehicle has a Certificate of Conformity' })
  }
  if (errorPresent) {
    if (req.session.data.myvt) {
      res.render('apply-for-a-vehicle-test/apply.html', { path: '/apply-for-a-vehicle-test/apply/certificate-of-conformity', query: req.query, errors })
    } else {
      res.render('certificate-of-conformity.html', { query: req.query, errors })
    }
  } else {
    const myvt = req.session.data['myvt'] ? '/apply-for-a-vehicle-test/apply' : ''
    res.redirect(`${myvt}/seat-belt-installation`)
  }
})

router.get('/vtp6', (req, res) => res.render('vtp6.html', { query: req.query }))
router.get('/vtp6-check', (req, res) => {
  let errorPresent = false
  let errors = []
  if (req.session.data['vtp6'] === undefined) {
    errorPresent = true
    errors.push({ href: '#vtp6', text: 'Select the document you need to replace' })
  }
  if (errorPresent) {
    if (req.session.data.myvt) {
      res.render('apply-for-a-vehicle-test/apply.html', { path: '/apply-for-a-vehicle-test/apply/vtp6', query: req.query, errors })
    } else {
      res.render('vtp6.html', { query: req.query, errors })
    }
  } else {
    const myvt = req.session.data['myvt'] ? '/apply-for-a-vehicle-test/apply' : ''
    res.redirect(`${myvt}/upload-form`)
  }
})

router.get('/seat-belt-installation', (req, res) => res.render('seat-belt-installation.html', { query: req.query }))
router.get('/seat-belt-check', (req, res) => {
  let errorPresent = false
  let errors = []
  if (req.session.data['seat-belt-installation'] === undefined) {
    errorPresent = true
    errors.push({ href: '#seat-belt-installation', text: 'Select if you need a seat belt installation check' })
  }
  if (errorPresent) {
    if (req.session.data.myvt) {
      res.render('apply-for-a-vehicle-test/apply.html', { path: '/apply-for-a-vehicle-test/apply/seat-belt-installation', query: req.query, errors })
    } else {
      res.render('seat-belt-installation.html', { query: req.query, errors })
    }
  } else {
    const myvt = req.session.data['myvt'] ? '/apply-for-a-vehicle-test/apply' : ''
    res.redirect(`${myvt}/vehicle-being-tested-alongside-mot`)
  }
})

router.get('/dda-schedules', (req, res) => res.render('seat-belt-installation.html', { query: req.query }))
router.get('/dda-schedules-check', (req, res) => {
  let errorPresent = false
  let errors = []
  if (req.session.data['schedules'] === undefined) {
    errorPresent = true
    errors.push({ href: '#schedules', text: 'Select what your accessibility certificate is for' })
  }
  if (errorPresent) {
    if (req.session.data.myvt) {
      res.render('apply-for-a-vehicle-test/apply.html', { path: '/apply-for-a-vehicle-test/apply/dda-schedules', query: req.query, errors })
    } else {
      res.render('dda-schedules.html', { query: req.query, errors })
    }
  } else {
    const myvt = req.session.data['myvt'] ? '/apply-for-a-vehicle-test/apply' : ''
    res.redirect(`${myvt}/upload-form`)
  }
})

router.get('/test-location', (req, res) => res.render('test-location.html', { query: req.query }))
router.get('/test-location-check', (req, res) => {
  if (req.query.find === 'find') {
    let errorPresent = false
    let errors = []
    if (req.session.data['find-test-centre'] === '') {
      errorPresent = true
      errors.push({ href: '#find-test-centre', text: 'Enter a test centre name, test centre number, address, postcode, phone number or email' })
    }
    if (errorPresent) {
      res.render('apply-for-a-vehicle-test/apply.html', { path: '/apply-for-a-vehicle-test/apply/test-location', query: req.query, errors })
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

router.get('/upload-form', (req, res) => res.render('/upload-form', { query: req.query }))
router.get('/upload-supporting-documentation', (req, res) => res.render('/upload-supporting-documentation', { query: req.query }))

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
          notifiableAlteration: currentFields['notifiable-alteration'],
          seatBeltInstallation: currentFields['seat-belt-installation'],
          mot: currentFields['tested-with-mot'],
          productCodes: potentialPcs,
          location: currentFields['test-location'],
          testCentre: currentFields.testCentre,
          time: currentFields['test-time'],
          supporting: currentFields['supporting-documentation']
        })
        currentVehicle.sizeOfPsv = currentFields['size-of-psv'] ?? false
      }
    }
  } else {
    currentFields.vehicles.push({
      vin: currentFields['vin'],
      vrm: currentFields['vrm'],
      category: currentFields['vehicle-category'],
      sizeOfPsv: currentFields['size-of-psv'] ?? undefined,
      unece: currentFields['unece'],
      axles: currentFields['axles'],
      class: currentFields['vehicle-class'],
      wav: currentFields.wav ?? false,
      wheels: currentFields['number-of-wheels'] ?? false,
      sizeOfPsv: currentFields['size-of-psv'] ?? false,
      schedules: currentFields['schedules'] ?? false,
      tests: [
        {
          test: currentFields['application-type'],
          form: currentFields['application-upload'],
          notifiableAlteration: currentFields['notifiable-alteration'],
          seatBeltInstallation: currentFields['seat-belt-installation'],
          mot: currentFields['tested-with-mot'],
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
  res.render('/check-your-answers.html', { query: req.query })
})

router.get('/add-vehicle', (req, res) => {
  const myvt = req.session.data['myvt'] ? '/apply-for-a-vehicle-test/apply' : ''
  req.session.data.vin = undefined
  req.session.data.vrm = undefined
  req.session.data['vehicle-category'] = undefined
  req.session.data['vehicle-class'] = undefined
  req.session.data.wav = undefined
  req.session.data['number-of-wheels'] = undefined
  req.session.data.axles = undefined
  req.session.data.unece = undefined
  req.session.data.schedules = undefined
  req.session.data['test-type'] = undefined
  req.session.data['application-type'] = undefined
  req.session.data['upload-form'] = undefined
  req.session.data['application-upload'] = undefined
  req.session.data['notifiable-alteration'] = undefined
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
  req.session.data['notifiable-alteration'] = undefined
  req.session.data['size-of-psv'] = undefined
  req.session.data['schedules'] = undefined
  req.session.data.sizeOfPsv = undefined
  req.session.data['upload-form'] = undefined
  req.session.data['application-upload'] = undefined
  req.session.data['supporting-documentation'] = undefined
  res.redirect(`${myvt}/test-type`)
})
