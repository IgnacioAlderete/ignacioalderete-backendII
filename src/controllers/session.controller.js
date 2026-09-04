import SessionService from "../services/session.services.js";
import { UserModel } from "../models/model.user.js"
import {generateToken} from "../utils/jwt.js"
import {createHash, isValidPassword} from "../utils/hash.js"

const sessionService = new SessionService();

export const register = async (req, res) => {


    const {first_name, last_name, email, password} = req.body
    if(!first_name || !last_name || !email || !password){
        return res.status(400).json({
            status: "error",
            message: "Todos los campos son obligatorios"
        })
    }

    const exists = await UserModel.findOne({email})
    if(exists) {

        //const user = await sessionService.register(req.body);

        return res.status(409).json({
            status: "error",
            message: "Ya existe un usuario refistrado con dicho email",
            user
        });
    } 

        const hashedPassword = createHash(password) 
        const newUser = UserModel.create({first_name, last_name, email, password:hashedPassword})

    res.status(201).json({
        status:"success",
        message:"Usuario registrado correctamente",
        payload: {
            id: newUser.id,
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email,
            role: newUser.role
        }
    })



    };

export const login = async (req,res) =>{
    try {

        const { email, password} = req.body

        if(!email || !password){
            return res.status(400).json({
                status: "error",
                message: "Email y contraseña son obligatorios"
            })
        }
        const normalizedEmail = email.toLowerCase().trim()

        const user = UserModel.findOne({
            email: normalizedEmail
        })

        if(!user){
            return res.status(401).json({
                status:"error",
                message: "Credenciales inválidas"
            })
        }

        const validPassword = await isValidPassword(password, user.password)

        if(!validPassword){
            return res.tatus(401).json({
                status: "error",
                message: "Credenciales inválidas"
            })
        }
        const tokenUser = {
            id: user_id,
            email: user.email,
            role: user.role
        }

        const token = generateToken(tokenUser)
            
        res.cookie("nuestra_cookie", token , {httpOnly:true, maxAge:60*60*1000})

        res.status(200).json({
            status: "success",
            message: "Login correcto"
            
        })
        

        
    } catch(error) {
        res.status(500).json({
            status: "error",
            message: "Error interno del servidor"
        })
    }
}

export const current = async (req, res) =>{
    try{
        const {id, email, role} = req.user;
    
        res.json({
            status: "success",
            user :{
                id,
                email,
                role
            }
        })
    
    } catch (error){
        res.status(500).json({
            status: "error",
            message: "Error al obtener usuario actualizado"
        })
    }
}

export const logout = async (req, res) =>{

    res.clearCookie("currentUser")

    res.json({
        status: "success",
        message: "Logout exitoso"
    })
}

