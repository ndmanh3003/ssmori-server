import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private role: string[]) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()

    if (!this.role.includes(request.user.type)) {
      throw new ForbiddenException('Do not have permission')
    }

    return true
  }
}
