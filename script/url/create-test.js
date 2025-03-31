import http from 'k6/http';
import { check } from 'k6';

export let options = {
    scenarios: {
        create_test: {
            executor: 'ramping-arrival-rate',
            startRate: 1000, // 시작 초당 요청 수 (초기값)
            timeUnit: '1s',  // 1초 단위
            preAllocatedVUs: 2000, // 미리 할당할 가상 사용자 수
            maxVUs: 5000, // 최대 가상 사용자 수 (요청률에 따라 조정)
            stages: [
                { target: 1157, duration: '30s' },   // 5분 동안 1157 req/sec까지 ramp-up
                { target: 1157, duration: '30s' },  // 10분간 유지
                { target: 0, duration: '30s' },      // 5분 동안 ramp-down
            ],
        },
    },
};

export default function () {
    const endpoint = 'http://nginx/url/create';
    // 전송할 URL 문자열 (따옴표 없이 plain text로 전송)
    const payload = 'https://test-domain.com/very_long_url';

    const params = {
        headers: { 'Content-Type': 'text/plain' }
    };

    let res = http.post(endpoint, payload, params);
    check(res, { 'status is 200': (r) => r.status === 200 });
}
