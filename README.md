# 💳 고성능 결제 데이터 파이프라인 및 이상 탐지 시스템

본 프로젝트는 대규모 결제 트래픽 환경에서 안정성과 성능 최적화를 목표로 설계되었습니다. 
Kafka를 활용한 비동기 통신과 AI 기반 이상 탐지를 결합하여 실시간 결제 검증 아키텍처를 구현했습니다.

### 🚀 Key Achievements (Performance Tuning)
Load Testing:k6를 활용한 최대 부하 테스트 진행 (가상 유저 500명 규모)
Throughput Optimization:20 TPS 지점의 병목 현상을 분석하여 Kafka 파티션 및 컨슈머 4배 확장을 통한 처리량 개선
Latency Control:JVM G1GC 튜닝을 적용하여 STW 시간을 100ms 이내로 제어
High Availability:Redis Sentinel도입으로 마스터 장애 시 자동 Failover 및 시스템 가용성 확보
70 TPS 달성(3.5배 성능 향상)
### 🛠 Tech Stack
Backend:Spring Boot(Java), FastAPI(Python) 
Infrastructure:Apache Kafka, Nginx, Redis Sentinel, Docker
AI Model:Isolation Forest (Anomaly Detection)
