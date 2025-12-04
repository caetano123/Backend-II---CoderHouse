const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const authorize = require('../middleware/authorize');
const { processPurchase } = require('../services/purchaseService');

router.post('/', passport.authenticate('jwt',{session:false}), authorize('user'), async (req,res,next) => {
  try {
    const items = req.body.items; // [{productId, qty}]
    const result = await processPurchase(req.user._id, items);
    res.json(result);
  } catch(err){ next(err); }
});

module.exports = router;
