const express = require("express");
const ImageKit = require("imagekit");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 ImageKit Signature Route
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

app.get("/api/signature", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.json(result);
});

// 🔐 Promo Code Validation API
app.post("/api/validate-promo", (req, res) => {
  const { code, amount, isNewUser } = req.body;

  const promoList = [
    {
      code: "FOODY100",
      discountType: "percent",
      value: 20,
      minAmount: 200,
      active: true,
      forNewUsersOnly: true,
    },
    {
      code: "WELCOME50",
      discountType: "flat",
      value: 50,
      minAmount: 100,
      active: true,
      forNewUsersOnly: false,
    },
  ];

  const promo = promoList.find(
    (p) => p.code.toLowerCase() === code.toLowerCase()
  );

  if (!promo || !promo.active) {
    return res.status(400).json({ error: "Invalid or inactive promo code" });
  }

  if (promo.forNewUsersOnly && !isNewUser) {
    return res
      .status(400)
      .json({ error: "This code is for new users only" });
  }

  if (amount < promo.minAmount) {
    return res
      .status(400)
      .json({ error: `Minimum amount should be ₹${promo.minAmount}` });
  }

  return res.json({ success: true, promo });
});

// ✅ Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);
