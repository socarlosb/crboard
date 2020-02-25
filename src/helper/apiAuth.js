const { SERVER_PASS } = require("../config");

// A simple pass auth for some core endpoints
const expectedPass = SERVER_PASS;

exports.isAdmin = async (req, res, next) => {
  const { pass } = req.headers;
  if (pass === expectedPass) return next();
  res.status(500).json({ error: "Permission denied" });
};
