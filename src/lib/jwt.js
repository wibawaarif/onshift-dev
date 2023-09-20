import jwt from 'jsonwebtoken'

// signing jwt
export function signJwtToken(payload, remember) {
    let duration = 6 * 24 * 60 * 60;

    if (remember) {
        duration = 30 * 24 * 60 * 60;
    }

    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(payload, secret, { expiresIn: duration });
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