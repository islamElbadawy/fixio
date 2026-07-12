import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { CreateWorkOrderCommand } from './create-work-order.command';
import {
  IWorkOrderRepository,
  WORK_ORDER_REPOSITORY,
} from '../../../domain/repositories/work-order.repository.interface';
import {
  IVehicleRepository,
  VEHICLE_REPOSITORY,
} from '../../../../vehicles/domain/repositories/vehicle.repository.interface';
import {
  ICustomerRepository,
  CUSTOMER_REPOSITORY,
} from '../../../../customers/domain/repositories/customer.repository.interface';
import { WorkOrder } from '../../../domain/entities/work-order.aggregate';
import { generateWorkOrderNumber } from '../../../../sales/application/utils/number-generator.util';
import { AuditService } from '../../../../shared/infrastructure/audit/audit.service';

@CommandHandler(CreateWorkOrderCommand)
export class CreateWorkOrderHandler implements ICommandHandler<CreateWorkOrderCommand> {
  constructor(
    @Inject(WORK_ORDER_REPOSITORY)
    private readonly workOrderRepo: IWorkOrderRepository,
    @Inject(VEHICLE_REPOSITORY)
    private readonly vehicleRepo: IVehicleRepository,
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepo: ICustomerRepository,
    private readonly auditService: AuditService,
  ) {}

  async execute(command: CreateWorkOrderCommand): Promise<WorkOrder> {
    const { dto, actorId } = command;

    const vehicle = await this.vehicleRepo.findById(dto.vehicleId);
    if (!vehicle)
      throw new NotFoundException(`Vehicle ${dto.vehicleId} not found`);

    const customer = await this.customerRepo.findById(dto.customerId);
    if (!customer)
      throw new NotFoundException(`Customer ${dto.customerId} not found`);

    const lastNumber = await this.workOrderRepo.findLastWorkOrderNumber();
    const workOrderNumber = generateWorkOrderNumber(lastNumber);

    const workOrder = WorkOrder.create(
      workOrderNumber,
      vehicle,
      customer,
      dto.mileageIn,
      dto.notes,
      dto.diagnosis,
    );

    await this.workOrderRepo.save(workOrder);

    await this.auditService.log(
      'WorkOrder',
      'CREATED',
      { workOrderNumber, vehicleId: dto.vehicleId, customerId: dto.customerId },
      workOrder.id,
      { actorId },
    );

    return workOrder;
  }
}
