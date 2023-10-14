import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { UserService } from 'src/user/user.service';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
    constructor(private readonly userService: UserService) { }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const method = request.method;
        const user = request?.user?.id;
        const url = request.url;

        await this.userService.saveLog({
            requestUrl: url,
            requestMethod: method,
            userId: user,
        })
        return next.handle().pipe(
            map(async (res) => {
                return res;
            }),
        );
    }
}
