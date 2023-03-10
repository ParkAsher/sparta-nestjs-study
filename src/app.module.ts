import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
    CacheModule,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config/dist';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthMiddleware } from './auth/auth.middleware';
import { BoardModule } from './board/board.module';
import { JwtConfigService } from './config/jwt.config.service';
import { TypeOrmConfigService } from './config/typeorm.config.service';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useClass: TypeOrmConfigService,
            inject: [ConfigService],
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useClass: JwtConfigService,
            inject: [ConfigService],
        }),
        CacheModule.register({
            ttl: 60000,
            max: 100,
            isGlobal: true,
        }),
        BoardModule,
        UserModule,
    ],
    controllers: [AppController],
    providers: [AppService, AuthMiddleware],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .forRoutes({ path: 'user/update', method: RequestMethod.PUT });
    }
}
