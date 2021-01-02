const myFunction = ({ paypal, dotenv }) => {
  return Object.freeze({
    initPaypal,
    paymentJSON,
    createPayment,
    executePayment,
  });

  dotenv.config(); // access env files

  function initPaypal({}) {
    paypal.configure({
      mode: process.env.MODE,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
    });

    return paypal;
  }

  function paymentJSON({ items, desc }) {
    let total = 0;
    // get total
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const price = item.price ? parseFloat(item.price) : 0;
      const qty = item.quantity ? item.quantity : 0;

      total = total + price * qty;
    }

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: process.env.RETURN_URL,
        cancel_url: process.env.CANCEL_URL,
      },
      transactions: [
        {
          item_list: {
            items,
          },
          amount: {
            currency: "USD", // note this
            total,
          },
          description: desc,
        },
      ],
    };

    return create_payment_json;
  }

  async function createPayment({ paypal, payJSON }) {
    const req = await new Promise((resolve) => {
      paypal.payment.create(payJSON, function (error, payment) {
        if (error) {
          const res = {
            status: 400,
            msg: `Error on create payment.`,
            error,
          };
          resolve(res);
        } else {
          const res = {
            status: 201,
            msg: `Success on create payment.`,
            payment,
          };
          resolve(res);
        }
      });
    });

    return req;
  }

  async function executePayment({ payerId, paymentId, trnsTotal, paypal }) {
    // create json obj
    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: "USD", // note this
            total: trnsTotal,
          },
        },
      ],
    };

    const req = await new Promise((resolve) => {
      paypal.payment.execute(
        paymentId,
        execute_payment_json,
        function (error, payment) {
          if (error) {
            console.log(error.response);
            const res = {
              status: 400,
              msg: `Error on payment.`,
              error: error.response,
            };
            resolve(res);
          } else {
            const res = {
              status: 201,
              msg: `Success on payment.`,
              payment,
            };
            resolve(res);
          }
        }
      );
    });

    return req;
  }
};
module.exports = myFunction;
