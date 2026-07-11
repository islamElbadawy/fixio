import { DomainException } from '../../../shared/domain/exceptions/domain.exception';

export class WorkOrderNotDraftException extends DomainException {
  constructor(id: string) {
    super(`Work order ${id} must be in DRAFT status for this operation`);
  }
}

export class WorkOrderNotInProgressException extends DomainException {
  constructor(id: string) {
    super(`Work order ${id} must be IN_PROGRESS for this operation`);
  }
}

export class WorkOrderAlreadyCompletedException extends DomainException {
  constructor(id: string) {
    super(`Work order ${id} is already completed`);
  }
}

export class WorkOrderCancelledException extends DomainException {
  constructor(id: string) {
    super(`Work order ${id} is cancelled and cannot be modified`);
  }
}

export class EmptyWorkOrderException extends DomainException {
  constructor(id: string) {
    super(
      `Work order ${id} has no lines — add services or parts before completing`,
    );
  }
}

export class PartAlreadyConsumedException extends DomainException {
  constructor(lineId: string) {
    super(`Part line ${lineId} has already been consumed from inventory`);
  }
}
