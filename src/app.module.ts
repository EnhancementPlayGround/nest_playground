import { Module } from '@nestjs/common';
import { HealthModule } from './libs/health/module';

@Module({
  imports: [HealthModule],
})
export class AppModule {}
