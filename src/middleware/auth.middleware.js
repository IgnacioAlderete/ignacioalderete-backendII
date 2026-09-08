import passport from "passport";

export const authenticateJWT = passport.authenticate("jwt", {
  session: false
});



export const authorization = (...roles) => {
    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                status: "error",
                message: "No autenticado"
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: "error",
                message: "No tienes permisos para realizar esta acción"
            });
        }

        next();
    };
};