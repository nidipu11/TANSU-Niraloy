package com.tansu.niraloy.service;

import com.tansu.niraloy.dto.PaymentDto;
import com.tansu.niraloy.model.Payment;
import java.util.List;

public interface PaymentService {
    Payment processPayment(PaymentDto paymentDto);
    List<Payment> getPaymentsByTenant(String tenantId);
    Payment getPaymentByTransactionId(String transactionId);

    // Escrow functionalities
    Payment processIncomingTenantPayment(Long bookingId, Double amount, String gatewayTxnId, String ownerId);
    void adminApproveAndReleaseInstantly(Long paymentId);
    void processMaturedEscrowPayments();
}