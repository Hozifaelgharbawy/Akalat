exports.isValid = (req) => {
  if (req.tokenData.role == "delivery") {
    let delivery = req.body.delivery ? req.body.delivery : req.query.delivery;
    if (!delivery || delivery != req.tokenData._id) return false
    else return true;
  }
  else return false;
}

exports.isValidEmail = (req) => {
  if (req.tokenData.role = "delivery") {
      let delivery = req.body.email ? req.body.email : req.query.email;
      if (!delivery || delivery != req.tokenData.email) return false
      else return true;
  }
  else return false;
}

exports.isValidDelivery = (req) => {
  if (req.tokenData.role == "delivery") {
    let delivery = req.body._id ? req.body._id : req.query._id;
    if (!delivery || delivery != req.tokenData._id) return false
    else return true;
  }
  else return false;
}