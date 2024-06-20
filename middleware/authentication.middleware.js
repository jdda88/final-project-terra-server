import jwt from "jsonwebtoken";

export default async function isAuth(req, res, next) {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "No token provided in headers" });
    }

    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token profided after bearer" });
    }

    const verified = jwt.verify(token, process.env.TOKEN_SIGN_SECRET);

    req.user = verified.payload;

    next();
  } catch (error) {
    console.log("Error inside auth middleware", error);

    if (error.message === "jwt malformed") {
      return res.status(401).json({ message: "no token provided (malformed)" });
    }

    res.status(401).json("Token not provided nor valid");
  }
}
