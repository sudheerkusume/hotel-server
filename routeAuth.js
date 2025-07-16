const jwt = require("jsonwebtoken")

const routeAuth1 = (req, res, next) => {
    const authHeader = req.header("Authorization");
const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    console.log("Recevied token:", token);

    if (!token) return res.status(401).send("Access denied. No token Provided");

    try{
        const decoded = jwt.verify(token, "hotel");
        req.user = decoded.user;
        next();
    } catch(err){
        console.log("Invalid token:", err.message);
        return res.status(400).json({message: "Invalid Token"});
    }
};

module.exports = routeAuth1