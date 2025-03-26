const jwt = require("jsonwebtoken")

const verifyJWTAuth = (req, res, next) => {
    const auth_token = req.headers.authorization;
    jwt.verify(auth_token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({ token : "Token Expired" });
            }
            return res.status(401).json({ message: "Unauthorized" });
        } else {
            const issuedAt = new Date(decoded.iat * 1000).toLocaleString();
            const expiresAt = new Date(decoded.exp * 1000).toLocaleString();

            console.log(`Issued At: ${issuedAt}`);
            console.log(`Expires At: ${expiresAt}`);

            req.user = decoded;
            next();
        }
    });
};

module.exports = { verifyJWTAuth };