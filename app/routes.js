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

router.get('/vehicle-category', (req, res) => {
  res.render('vehicle-category.html')
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
