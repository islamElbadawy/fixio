import { DomainException } from '../../../shared/domain/exceptions/domain.exception';

export class OrderAlreadyConfirmedException extends DomainException {
  constructor(orderId: string) {
    super(`Order ${orderId} is already confirmed`);
  }
}

export class OrderNotConfirmedException extends DomainException {
  constructor(orderId: string) {
    super(`Order ${orderId} must be confirmed before invoicing`);
  }
}

export class OrderAlreadyInvoicedException extends DomainException {
  constructor(orderId: string) {
    super(`Order ${orderId} has already been invoiced`);
  }
}

export class EmptyOrderException extends DomainException {
  constructor(orderId: string) {
    super(`Order ${orderId} has no lines — add items before confirming`);
  }
}

export class OrderCancelledException extends DomainException {
  constructor(orderId: string) {
    super(`Order ${orderId} is cancelled and cannot be modified`);
  }
}

export class InvoiceAlreadyPaidException extends DomainException {
  constructor(invoiceId: string) {
    super(`Invoice ${invoiceId} is already fully paid`);
  }
}

export class OverpaymentException extends DomainException {
  constructor(invoiceId: string, amount: number, remaining: number) {
    super(
      `Payment amount ${amount} exceeds remaining balance ${remaining} on invoice ${invoiceId}`,
    );
  }
}
