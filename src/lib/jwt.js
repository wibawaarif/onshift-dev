import jwt from 'jsonwebtoken'

// signing jwt
export function signJwtToken(payload) {
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(payload, secret, { expiresIn: 6 * 24 * 60 * 60, });
    return token;
}


// verifying jwt
export function verifyJwtToken(token) {
    try {
        const secret = process.env.JWT_SECRET;
        const payload = jwt.verify(token, secret);
        return payload;
    } catch (error) {
        console.error(error);
        return null;
    }
}