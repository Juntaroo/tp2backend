import jwt from "jsonwebtoken";

const SECRET_KEY = "tremendaclave";


const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"]; //obtengo el encabezado de la autorizacion

    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1]; //extraigo el token después del bearer
        jwt.verify(token, SECRET_KEY, (err, decoded) => {//verifico el token
        if (err) {
            return res.status(401).json({ msg: "Token no válido" });
        }
        req.user = decoded; //guardo el token decodificado en el objeto de solicitud
        next();
    });
    } else {
        return res.status(403).json({ msg: "No se proporcionó token" });
    }
};

export default verifyToken;