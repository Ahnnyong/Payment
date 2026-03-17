import http from 'k6/http';
import { check, sleep } from 'k6';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';


export const options = {
  stages: [
    { duration: '1m', target: 1000 }, // 2분 동안 6000명까지 서서히 증가 (Ramp-up)
    { duration: '3m', target: 1000 }, // 6분 동안 6000명 유지 (Peak load)
    { duration: '1m', target: 0 },    // 2분 동안 서서히 감소 (Ramp-down)
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
  },
};

export default function () {
  const uniqueOrderId = `ORD-${uuidv4().substring(0, 8)}`;
  
  // 6개 파라미터 생성
  const userId = Math.floor(Math.random() * 1000) + 1;
  const timeDiff = (Math.random() * 100).toFixed(2);
  const locDiff = Math.floor(Math.random() * 3);
  const isNight = Math.random() > 0.8 ? 1 : 0;
  const isHighAmount = Math.random() > 0.9 ? 1 : 0;

  // URL 생성 (파라미터 이름이 Spring Boot Controller와 일치해야 함)
  const url = `http://localhost/pay?orderId=${uniqueOrderId}&userId=${userId}&timeDiff=${timeDiff}&locDiff=${locDiff}&isNight=${isNight}&isHighAmount=${isHighAmount}`;

  const res = http.get(url);

  // 에러 방지를 위해 res.body가 있을 때만 체크
  check(res, {
    'is status 200': (r) => r.status === 200,
    'contains success message': (r) => r.body && r.body.includes('전송되었습니다'),
  });

  sleep(0.1);
}