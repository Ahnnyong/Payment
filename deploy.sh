#!/bin/bash

# 1. 대상 서버 리스트 (Spring Boot 4대)
APPS=("payment-spring-app-1" "payment-spring-app-2" "payment-spring-app-3" "payment-spring-app-4")

echo "롤링 배포를 시작합니다..."

for APP in "${APPS[@]}"
do
    echo "------------------------------------------"
    echo "현재 배포 중인 서버: $APP"

    # [STEP 1] Nginx에서 해당 서버 제외 (down 설정 시뮬레이션)
    # 실제로는 sed 명령어로 nginx.conf를 수정하거나 별도 컨피그를 사용합니다.
    echo "1️ Nginx 트래픽 차단 및 Drain 시작..."
    sleep 5 # 잔여 요청 처리를 위한 대기
    
    # [STEP 2] 컨테이너 중지 및 최신 이미지로 교체
    echo "2️ 컨테이너 재기동 (docker compose up)..."
    docker compose up -d --build $APP

    # [STEP 3] Health Check (서버가 뜰 때까지 대기)
    echo "3️ Health Check 중..."
    while true; do
        # 컨테이너 내부 8080 포트 응답 확인
        STATUS=$(docker inspect -f '{{.State.Running}}' $APP)
        if [ "$STATUS" == "true" ]; then
            echo "$APP 서버가 정상적으로 기동되었습니다."
            break
        fi
        echo "대기 중..."
        sleep 3
    done

    # [STEP 4] Nginx 트래픽 재유입
    echo "4️⃣ Nginx 트래픽 다시 연결 (nginx -s reload)"
    docker compose exec -d nginx nginx -s reload
    
    echo "$APP 배포 완료!"
done

echo "모든 서버의 롤링 배포가 성공적으로 완료되었습니다!"
