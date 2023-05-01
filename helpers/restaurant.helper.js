exports.isValid = (req) => {
  if (req.tokenData.role == "restaurant") {
    let restaurant = req.body.restaurant ? req.body.restaurant : req.query.restaurant;
    if (!restaurant || restaurant != req.tokenData._id) return false
    else return true;
  }
  else return false;
}


exports.isValidRestaurant = (req) => {
  if (req.tokenData.role == "restaurant") {
    let restaurant = req.body._id ? req.body._id : req.query._id;
    if (!restaurant || restaurant != req.tokenData._id) return false
    else return true;
  }
  else return false;
}


exports.isValidEmail = (req) => {
  if (req.tokenData.role == "restaurant") {
    let restaurant = req.body.email ? req.body.email : req.query.email;
    if (!restaurant || restaurant != req.tokenData.email) return false
    else return true;
  }
  else return false;
}