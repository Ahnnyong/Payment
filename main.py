import asyncio
import json
import joblib
from fastapi import FastAPI
from aiokafka import AIOKafkaConsumer, AIOKafkaProducer

app = FastAPI()

# 1. 모델 로드
model = joblib.load("isolation_forest_model.pkl")

# 2. Kafka 컨슈머/프로듀서 루프
async def consume_and_predict():
    consumer = AIOKafkaConsumer(
        "payment-topic", 
        bootstrap_servers='localhost:9092',
        group_id="anomaly-detection-group" # 컨슈머 그룹 지정
    )
    producer = AIOKafkaProducer(bootstrap_servers='localhost:9092')
    
    await consumer.start()
    await producer.start()
    
    print("Kafka 컨슈머가 'payment-topic'을 구독하기 시작했습니다...")
    
    try:
        async for msg in consumer:
            # 1. 메시지 수신 및 파싱
            payment_data = json.loads(msg.value)
            
            # 2. 모델 추론 (Spring Boot에서 'features' 키에 데이터를 담아 보낸다고 가정)
            features = [
            payment_data['time_diff'],
            payment_data['loc_diff'],
            payment_data['is_night'],
            payment_data['is_high_amount']
            ]

            # 예측 수행
            prediction = model.predict([features])
            is_anomalous = True if prediction[0] == -1 else False
            
            # 3. 결과 전송
            result = {
                "orderId": payment_data['orderId'], 
                "isAnomalous": is_anomalous
            }
            await producer.send_and_wait(
                "detection-result-topic", 
                json.dumps(result).encode('utf-8')
            )
            print(f"분석 완료: OrderId {payment_data['orderId']} -> {'이상' if is_anomalous else '정상'}")
            
    except Exception as e:
        print(f"에러 발생: {e}")
    finally:
        await consumer.stop()
        await producer.stop()

# 3. FastAPI 서버 시작 시 Kafka 루프를 백그라운드에서 실행
@app.on_event("startup")
async def startup_event():
    # 비동기로 Kafka 루프 실행
    asyncio.create_task(consume_and_predict())

@app.get("/")
def read_root():
    return {"status": "Kafka 컨슈머 서버 가동 중"}
