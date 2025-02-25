const jwt = require("jsonwebtoken");

// _________Middleware to verify the token  ________

function authMiddleware(req, res, next) {
  // req.body , req.params , req.headers
  let authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send({ msg: "Unauthorized User" });

  let clientToken = authHeader.split(" ")[1];
  try {
    let decodedToken = jwt.verify(clientToken, process.env.SECRET_KEY);
    //  we will add a key called user and set to the decodedToken
    req.user = decodedToken;
    next();
  } catch (error) {
    console.log(error);
    res.send(error);
  }
}

module.exports = authMiddleware;
// 🦖