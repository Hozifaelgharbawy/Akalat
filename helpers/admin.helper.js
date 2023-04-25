exports.isValidEmail = (req) => {
    if (req.tokenData.role = "admin") {
        let admin = req.body.email ? req.body.email : req.query.email;
        if (!admin || admin != req.tokenData.email) return false
        else return true;
    }
    else return false;
}

exports.isValidAdmin = (req) => {
    if (req.tokenData.role = "admin") {
        let admin = req.body._id ? req.body._id : req.query._id;
        if (!admin || admin != req.tokenData._id) return false
        else return true;
    }
    else return false;
}