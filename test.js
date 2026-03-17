import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 500 }, // 1,000명 테스트
    { duration: '1m', target: 500 },
    { duration: '30s', target: 0 },
  ],
};

export default function () {
  // 실제 컨트롤러에 맞는 경로와 파라미터를 추가했습니다.
  const url = 'http://13.236.1.107/pay?orderId=test_order&userId=1&timeDiff=0.5&locDiff=0&isNight=0&isHighAmount=0';
  
  const res = http.get(url);
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'contains success message': (r) => r.body.includes('결제 요청이 카프카로 전송되었습니다'),
  });
  
  sleep(1);
}