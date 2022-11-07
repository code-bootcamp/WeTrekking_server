import { CACHE_MANAGER, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';

export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache, //
  ) {
    super({
      jwtFromRequest: (req) => {
        const cookie = req.headers.cookie;
        const refreshToken = cookie.replace('refreshToken=', '');
        return refreshToken;
      },
      secretOrKey: 'myRefreshKey',
      passReqToCallback: true,
    });
  }
  async validate(req, payload) {
    // console.log('payload: ', payload);

    const refreshToken = req.headers['cookie'].replace('refreshToken=', '');

    const checkRefreshToken = await this.cacheManager.get(
      `refreshToken:${refreshToken}`,
    );

    if (checkRefreshToken)
      throw new UnauthorizedException('다시 로그인 해주세요');

    return {
      email: payload.email,
      id: payload.sub,
    };
  }
}
