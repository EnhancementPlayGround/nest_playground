import http from 'k6/http';
import { sleep, check } from 'k6';

const url = 'http://host.docker.internal:4000';

export const options = {
  stages: [
    { duration: '30s', target: 100 },
    { duration: '1m30s', target: 2000 },
    { duration: '20s', target: 0 },
  ],
};
export default async function () {
  await http.get(`${url}/products`);
  await http.get(`${url}/accounts?userId=asdf`);
  await http.patch(`${url}/accounts`, JSON.stringify({ userId: 'asdf', amount: 1000 }), {
    headers: { 'Content-Type': 'application/json' },
  });
  await http.get(`${url}/accounts?userId=asdf`);
  await http.post(`${url}/orders`, JSON.stringify({ userId: 'asdf', lines: [{ productId: 'asdf2', quantity: 1 }] }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
