exports.isValidEmail = (req) => {
    if (req.tokenData.role == "user") {
        let user = req.body.email ? req.body.email : req.query.email;
        if (!user || user != req.tokenData.email) return false       
        else return true;
    }
    else return false;
}

exports.isValidUser = (req) => {
    if (req.tokenData.role = "user") {
        let user = req.body._id ? req.body._id : req.query._id;
        if (!user || user != req.tokenData._id) return false
        else return true;
    }
    else return false;
}