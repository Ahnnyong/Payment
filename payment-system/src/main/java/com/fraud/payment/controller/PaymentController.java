package com.fraud.payment.controller;

import com.fraud.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping("/pay")
    public String pay(
            @RequestParam String orderId,
            @RequestParam Long userId,
            @RequestParam Double timeDiff,
            @RequestParam Integer locDiff,
            @RequestParam Integer isNight,
            @RequestParam Integer isHighAmount
    ) {
        paymentService.sendPaymentRequest(orderId, userId, timeDiff, locDiff, isNight, isHighAmount);
        return "결제 요청이 카프카로 전송되었습니다: " + orderId;
    }
}