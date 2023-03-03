import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { createDBConnection } from './configuration';
import { UserModule } from './user/user.module';

@Module({
  imports: createDBConnection(UserModule),
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
