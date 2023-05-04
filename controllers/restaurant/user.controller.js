const user = require("../../modules/User/user.repo");
const cart = require("../../modules/Cart/cart.repo");

exports.getClientWithCart = async (req, res) => {
  try {
    let filter
    if (Object.keys(req.query).length != 0) {
      filter = {
        role: "user",
        ...req.query
      };
    }
    const result = await user.get(filter);
    if (!result.success) return res.status(result.code).json({ success: result.success, code: result.code, error: result.error });
    const userCart = await cart.get({ user: result.record._id });
    if (result.success || userCart.success) {
      res.status(200).json({
        success: true,
        code: 200,
        record: { user: result.record, cart: userCart.record }
      });
    } else return res.status(500).json({
      success: false,
      code: 500,
      error: "Unexpected Error!"
    });
  } catch (err) {
    console.log(`err.message`, err.message);
    res.status(500).json({
      success: false,
      code: 500,
      error: "Unexpected Error!"
    });
  }
}