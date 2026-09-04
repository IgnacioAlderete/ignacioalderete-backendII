import jwt from "jsonwebtoken";

export const auth = (req, res, next)=>{
    const token = req.cookies.currentUser;
    if(!token){
        return res.status(401).json({
            status: "error",
            message: "No autenticado"
        })
    }

    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET)
    
        req.user = payload;
        next()
    
    } catch(error){
        return res.status(401).json({
            status:"error",
            message: "Token inválido o expirado"
        })

    }
}


