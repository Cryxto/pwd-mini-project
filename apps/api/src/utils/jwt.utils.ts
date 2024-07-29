import { ENV } from '@/config';
import { AuthJWTInterface } from '@/interfaces/auth.interface';
import jwt from 'jsonwebtoken';
const { JWT_SECRET } = ENV;

export async function genJWT(data: AuthJWTInterface | object) {
  return jwt.sign(data, JWT_SECRET!, { expiresIn: '5 days' });
}

export async function verifyJWT(
  token: string,
): Promise<string | jwt.JwtPayload | boolean> {
  try {
    // console.log(JWT_SECRET);
    
    const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET!);
    console.log(decoded);
    
    return decoded;
  } catch (error) {
    console.log(error);
    
    return false;
  }
}

//note
//to prevent csrf, for identifier use samesite lax, and set another httponly cookie but samesite strict for securing any get methon url for action like logout or submit using get
