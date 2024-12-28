import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Observable } from 'rxjs'
import { TokenService } from 'src/auth/token.service'

export interface IUser {
  id: number
  roles: 'C' | 'B' | 'S'
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()

    const token = request.headers.authorization.split(' ')[1]

    if (!token) {
      throw new ForbiddenException('Token not found')
    }

    const user = this.tokenService.verifyToken(token)

    if (user) {
      const { iat: _iat, exp: _exp, ...rest } = user

      request.user = rest as unknown as IUser

      return true
    }

    throw new ForbiddenException('Invalid token')
  }
}
