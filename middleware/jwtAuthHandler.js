const jwt = require("jsonwebtoken")

const verifyJWTAuth = (req, res, next) => {
    const token = req.headers.authorization;
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Unauthorized" });
        } else {
            req.user = decoded;
            next();
        }
    });
};

module.exports = { verifyJWTAuth };