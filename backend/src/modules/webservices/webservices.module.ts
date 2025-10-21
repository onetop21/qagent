import { Module } from '@nestjs/common';
import { WebServicesController } from './webservices.controller';
import { WebServicesService } from './webservices.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [WebServicesController],
  providers: [WebServicesService],
  exports: [WebServicesService],
})
export class WebServicesModule {}
