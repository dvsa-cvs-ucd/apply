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
router.get('/test-type', (req, res) => res.render('test-type.html', {query: req.query}))
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
