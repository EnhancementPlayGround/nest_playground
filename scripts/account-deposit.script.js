import http from 'k6/http';
import { check } from 'k6';

const url = 'http://host.docker.internal:4000';

export const options = {
  stages: [
    { duration: '30s', target: 100 },
    { duration: '1m30s', target: 1000 },
    { duration: '20s', target: 0 },
  ],
};
export default async function () {
  const res = await http.patch(`${url}/accounts`, JSON.stringify({ userId: 'asdf', amount: 1000 }), {
    headers: { 'Content-Type': 'application/json' },
  });
  check(res, { 'status was 200': (r) => r.status === 200 });
}
