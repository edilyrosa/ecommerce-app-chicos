import jwt from 'jsonwebtoken';

export function verificarToken(token) {
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        return {valid:true, data: decoded}

    }catch(error){
        return {valid:false, data: error.message}
    }
}

export function crearToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '7d'})
}