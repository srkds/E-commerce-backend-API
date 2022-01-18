const stripe = require("stripe")(
  "sk_test_51KIuCOSJ3giIz90xvj9P6jMpT3nuFn4cJa4KyQoJE0JLtniskOaZn6QvTLUGEx15FYCc7cALqFZS7Wbmdrrkc3Nu00dgUhXUla"
);
const { v4: uuidv4 } = require("uuid");

exports.makepayment = (req, res) => {
  const { products, token } = req.body;
  console.log("PRODUCTS", products);

  let amount = 0;
  products.map((p) => {
    amount = amount + p.price;
  });

  const idempotencyKey = uuidv4();

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges
        .create(
          {
            amount: amount * 100,
            currency: "usd",
            customer: customer.id,
            receipt_email: token.email,
            description: `purchase of ${amount}`,
            shipping: {
              name: token.card.name,
              address: {
                country: token.card.address_country,
              },
            },
          },
          { idempotencyKey }
        )
        .then((result) => res.status(200).json(result))
        .catch((err) => console.log(err));
    });
};
