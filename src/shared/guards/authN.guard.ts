import {
    CanActivate,
    ExecutionContext,
    Injectable,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';


@Injectable()
export class AuthNGuard implements CanActivate {
    private readonly logger = new Logger('AuthNGuard');
    constructor(
        private readonly userService: UserService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const token = this.getToken(context);
        try {
            if (token === 'no-token') {
                return false
            }
            const user = await this.userService.verifyToken(token);
            this.appendUser({ ...user }, context);
        } catch (err) {
            if (!err.failedAssertion) {
                this.logger.error(err);
            } else {
                this.logger.error({
                    message: 'Invalid token provided.'
                });
            }
            throw new UnauthorizedException();
        }
        return true;
    }

    private getToken(context: ExecutionContext) {
        let authorization: string;
        authorization = context
            .switchToHttp()
            .getRequest()
            .headers?.authorization?.replace('Bearer ', '');
        if (!authorization) {
            return 'no-token';
        }
        return authorization;
    }

    private appendUser(user: any, context: ExecutionContext) {
        context.switchToHttp().getRequest().user = user;
    }
}
