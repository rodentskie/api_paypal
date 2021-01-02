const paypal = require("paypal-rest-sdk");
const dotenv = require("dotenv");

const crypto = require("crypto");
const algorithm = process.env.ALGORITHM;
const password = process.env.ENCRYPTION_KEY;
const iv = process.env.IV;

// ################
const myFunction = require("./paypal");
const encrypts = require("./encrypt");
const decrypts = require("./decrypt");
// ################
const myFunctions = myFunction({ paypal, dotenv });
const encrypt = encrypts({ crypto, algorithm, password, iv });
const decrypt = decrypts({ crypto, algorithm, password, iv });
// ################
const services = Object.freeze({
  myFunctions,
  encrypt,
  decrypt,
});

module.exports = services;

module.exports = {
  myFunctions,
  encrypt,
  decrypt,
};
