import { ForbiddenException, Injectable } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'

@Injectable()
export class TokenService {
  private readonly expiresIn = '1y'

  generateToken(payload: Record<string, unknown>): string {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: this.expiresIn })
  }

  verifyToken(token: string): Record<string, unknown> {
    try {
      return jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
      throw new ForbiddenException(err.message)
    }
  }
}
