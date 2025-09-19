// src/auth/jwt-auth.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(ctx: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      ctx.getHandler(), // el método puede overridear a la clase
      ctx.getClass(),
    ]);
    if (isPublic) return true;
    return super.canActivate(ctx);
  }
}
