export class PaymentGatewayDto {
    paypalClientId: string;
    stripePublicApiKey: string;
}

export class CreatePaymentDto{
    amount: string;
    currency: string;
    provider: string;
}