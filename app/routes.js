//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

vesKey = process.env.VES_API_KEY

// Add your routes here

router.get('/ready-check', (req, res) => {
  const ready = req.session.data['ready-to-upload'] === 'yes'
  if (ready) {
    res.redirect('/what-is-your-name')
  } else {
    res.redirect('/vehicle-category')
  }
})

router.get('/what-is-your-name', (req, res) => res.render('what-is-your-name.html', {query: req.query}))
router.get('/what-is-your-email-address', (req, res) => res.render('what-is-your-email-address.html', {query: req.query}))
router.get('/what-is-your-phone-number', (req, res) => res.render('what-is-your-phone-number.html', {query: req.query}))
router.get('/vehicle-details', (req, res) => res.render('vehicle-details.html', {query: req.query}))
router.get('/vehicle-data', (req, res) => res.render('vehicle-data.html', {query: req.query}))
router.get('/vehicle-category', (req, res) => res.render('vehicle-category.html', {query: req.query}))
router.get('/test-type', (req, res) => res.render('test-type.html'))
router.get('/application-type', (req, res) => res.render('application-type.html', {query: req.query}))

router.get('/download-form', (req, res) => {
  const formToDownload = req.query['test-type'] ?? req.session.data['test-type']
  if (formToDownload !== undefined) {
    res.render('download-form')
  } else {
    res.redirect('/vehicle-category')
  }
})

router.get('/vrm-check', async (req, res) => {
  const reg = { registrationNumber: req.session.data.vrm }
  const response = await fetch('https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles', {
    method: 'POST',
    headers: {
      'x-api-key': vesKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reg)
  })
  req.session.data.vehicle = await response.json()
  if (response.status === 200) {
    res.redirect('/vehicle-data')
  } else {
    res.redirect('/vehicle-category')
  }
})

router.get('/change-vehicle', (req, res) => {
  currentVehicle = req.session.data.vehicles[req.session.data['changing']]
  currentVehicle.vin = req.session.data['vin']
  currentVehicle.vrm = req.session.data['vrm']
  req.session.data.changedVehicle = true
  res.redirect('/check-your-answers')
})

router.get('/upload-form', (req, res) => res.render('/upload-form', {query: req.query}))
router.get('/upload-supporting-documentation', (req, res) => res.render('/upload-supporting-documentation', {query: req.query}))

router.get(['/upload-check'], (req, res) => {
  req.session.data.removed = undefined
  req.session.data.uploaded = undefined
  if (req.query.continue) {
    res.redirect('/check-your-answers')
  } else {
    if (req.query['upload-multiple'] !== undefined && req.query['supporting-documentation-upload'].length !== 0) {
      req.session.data.error = false
      if (req.session.data['supporting-documentation'] === undefined) req.session.data['supporting-documentation'] = []
      req.session.data['supporting-documentation'] = req.session.data['supporting-documentation'].concat(req.session.data['supporting-documentation-upload'])
      res.redirect('/upload-supporting-documentation?uploaded=1')
    } else {
      req.session.data.error = true
      res.redirect('/upload-supporting-documentation')
    }
  }
})

router.get(['/remove-file'], (req, res) => {
  const indexToRemove = req.session.data['supporting-documentation'].indexOf(req.query.filename)
  req.session.data['supporting-documentation'].splice(indexToRemove, 1)
  req.session.data.removed = req.query.filename
  res.redirect('/upload-supporting-documentation')
})

router.get('/check-your-answers', (req, res) => {
  const currentFields = req.session.data
  const currentVehicle = currentFields.vehicles.find(vehicle => currentFields['vin'] === vehicle.vin || currentFields['vrm'] === vehicle.vrm)
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
          supporting: currentFields['supporting-documentation']
        }
        ]
    })
  }
  res.render('/check-your-answers', {query: req.query})
})

router.get('/add-vehicle', (req, res) => {
  req.session.data.vin = undefined
  req.session.data.vrm = undefined
  req.session.data['vehicle-category'] = undefined
  req.session.data['test-type'] = undefined
  req.session.data['application-type'] = undefined
  req.session.data['upload-form'] = undefined
  req.session.data['supporting-documentation'] = undefined
  res.redirect('/vehicle-details')
})

router.get('/add-test', (req, res) => {
  req.session.data['vehicle-category'] = req.session.data.vehicles[req.session.data.addTo]['category']
  req.session.data.vin = req.session.data.vehicles[req.session.data.addTo].vin
  req.session.data.vrm = req.session.data.vehicles[req.session.data.addTo].vrm
  req.session.data['test-type'] = undefined
  req.session.data['application-type'] = undefined
  req.session.data['application-upload'] = undefined
  req.session.data['supporting-documentation'] = undefined
  res.redirect('/test-type')
})
