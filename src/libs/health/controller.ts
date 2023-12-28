import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HttpHealthIndicator, HealthCheck } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(private health: HealthCheckService, private http: HttpHealthIndicator) {}

  @Get()
  @HealthCheck()
  check() {
    // 통신할 우리 서비스를 healthCheck로 찌르는게 더 낫다 .
    return this.health.check([() => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com')]);
  }

  @Get('test')
  healths() {
    return 'ok';
  }
}
