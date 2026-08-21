package com.fraud.payment.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DetectionResultListener {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @KafkaListener(topics = "detection-result-topic", groupId = "payment-group")
    public void consume(String message) {
        try {
            // 1. FastAPI가 보낸 JSON 파싱
            JsonNode jsonNode = objectMapper.readTree(message);
            String orderId = jsonNode.get("orderId").asText();
            boolean isAnomalous = jsonNode.get("isAnomalous").asBoolean();

            // 2. 결과에 따른 후속 로직 처리
            if (isAnomalous) {
                System.out.println("[위험] OrderID: " + orderId + " - 이상 결제 징후 발견 결제 차단 및 추가 인증 필요.");
                // TODO: 결제 상태를 'CANCELED' 또는 'PENDING_AUTH'로 업데이트하는 DB 로직
            } else {
                System.out.println("[정상] OrderID: " + orderId + " - 정상 결제 승인 프로세스 진행.");
                // TODO: 결제 완료 로직 실행
            }

        } catch (Exception e) {
            System.err.println("결과 메시지 파싱 에러: " + e.getMessage());
        }
    }
}
