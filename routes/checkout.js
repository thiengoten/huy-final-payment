var express = require('express')
var router = express.Router()
const stripe = require('stripe')(
  'sk_test_51QOj0uAOd6OKB0UOlxZXX9ohQowPL9TLFVW020FoqXykw7iMdFzQoVoJqtBYEojGX0jYJkajbEOmthcC1Q3uSXOd00SgPKffCn'
)

/* GET home page. */
router.post('/', async function (req, res, next) {
  const { products } = req.body

  const orderItems = products.map((item) => {
    return {
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.title,
          images: [item.images[0]],
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }
  })

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: orderItems,
    success_url: 'http://localhost:5173/notify/success',
    cancel_url: 'http://localhost:5173/notify/error',
  })
  res.status(200).json({ clientUrl: session.url })
})

module.exports = router
