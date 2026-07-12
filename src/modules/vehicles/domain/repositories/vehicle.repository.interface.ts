import { VehicleEntity } from '../entities/vehicle.entity';

export const VEHICLE_REPOSITORY = Symbol('IVehicleRepository');

export interface IVehicleRepository {
  findById(id: string): Promise<VehicleEntity | null>;
  findByLicensePlate(plate: string): Promise<VehicleEntity | null>;
  findByCustomer(customerId: string): Promise<VehicleEntity[]>;
  findAll(): Promise<VehicleEntity[]>;
  save(vehicle: VehicleEntity): Promise<void>;
  create(data: Partial<VehicleEntity>): VehicleEntity;
}
