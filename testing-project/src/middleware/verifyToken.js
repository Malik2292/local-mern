const jwt = require("jsonwebtoken")
const { jwtTokenSecret } = require("../lib/exports")

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No valid token provided" })
  }

  const token = authHeader.split(" ")[1]

  jwt.verify(token, jwtTokenSecret, (err, decoded) => {
    if (err) {
      const message = err.message || "Invalid token"
      return res.status(403).json({ message })
    }
    req.decodedToken = decoded
    next()
  })
}

module.exports = verifyToken
