import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';

@Module({
  imports: [TerminusModule, HealthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
