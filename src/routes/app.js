const express = require("express");
const router = express.Router();
const { myFunctions, decrypt } = require("../functions/app"); // functions

// create payment
router.post("/create", async (req, res, next) => {
  // init paypal
  const paypal = myFunctions.initPaypal({});

  // get items from body
  const { items, desc } = req.body;
  if (!desc) return res.status(400).send(`Please enter description.`);
  if (items.length <= 0) return res.status(400).send(`Please enter items.`);

  // make payment JSON
  const payJSON = myFunctions.paymentJSON({ items, desc });

  // create payment
  const create = await myFunctions.createPayment({ paypal, payJSON });

  let approve_url = null;

  // error on create payment
  if (create.status == 400)
    return res.status(400).send(`Error on creating payment.`);
  else {
    const links = create.payment.links;
    // get the approve url for redirecting of the user;
    for (let i = 0; i < links.length; i++) {
      const e = links[i];
      if (e.rel == "approval_url") {
        approve_url = e.href;
        break;
      }
    }
  }

  // return approval url
  return res.status(201).send(approve_url);
});

// successful create payment
router.post("/success", async (req, res, next) => {
  const { payerId, paymentId, total } = req.body;
  if (!payerId) return res.status(400).send(`Please enter payer.`);
  if (!paymentId) return res.status(400).send(`Please enter payment.`);
  if (total == null) return res.status(400).send(`Please enter total.`);

  // init paypal
  const paypal = myFunctions.initPaypal({});

  const trnsTotal = decrypt(total); // transaction total payment amount

  const pay = await myFunctions.executePayment({
    payerId,
    paymentId,
    trnsTotal,
    paypal,
  });

  if (pay.status == 400)
    return res.status(400).send(`Error on posting payment.`);
  return res.status(201).send(JSON.stringify(pay.payment));
});

module.exports = router;
