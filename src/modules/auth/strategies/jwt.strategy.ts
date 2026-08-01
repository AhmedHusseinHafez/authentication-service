import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvConfigService } from '../../../config/env.config';

export type JwtPayload = {
    sub: string;
    email: string;
    role: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(config: EnvConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get('JWT_ACCESS_SECRET'),
        });
    }

    override validate(payload: JwtPayload) {
        // Becomes req.user on protected routes
        return {
            id: payload.sub,
            email: payload.email,
            role: payload.role,
        };
    }
}


