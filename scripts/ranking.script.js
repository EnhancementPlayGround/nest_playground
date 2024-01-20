import http from 'k6/http';
import { sleep, check } from 'k6';

const url = 'http://host.docker.internal:4000';

export const options = {
  stages: [
    { duration: '30s', target: 100 },
    { duration: '1m30s', target: 1000 },
    { duration: '20s', target: 0 },
  ],
};
export default async function () {
  const res = await http.get(
    `${url}/order-product-logs/rankings?occurredAtStart=2024-01-01T00:00:00.000Z&occurredAtEnd=${new Date().toISOString()}&limit=5`,
  );
  check(res, { 'status was 200': (r) => r.status === 200 });
  sleep(1);
}
