import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common'
import { Observable } from 'rxjs'
import { TokenService } from 'src/auth/token.service'

export interface IUser {
  id: number
  type: 'C' | 'B' | 'S'
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const bypassGuards = Reflect.getMetadata('bypassGuards', context.getHandler())

    if (bypassGuards) {
      return true
    }

    const request = context.switchToHttp().getRequest()

    const token = request.headers.authorization

    if (!token || !token.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token not found')
    }

    const user = this.tokenService.verifyToken(token.split(' ')[1])

    if (user) {
      const { iat: _iat, exp: _exp, ...rest } = user

      request.user = rest as unknown as IUser

      return true
    }

    throw new ForbiddenException('Invalid token')
  }
}
