import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { UserProfileModule } from './user-profile/user-profile.module';
import { ProgramModule } from './program/program.module';
import { JobModule } from './job/job.module';
import { ProductModule } from './product/product.module';
import { DonationModule } from './donation/donation.module';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, UserProfileModule, ProgramModule, JobModule, ProductModule, DonationModule],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}
