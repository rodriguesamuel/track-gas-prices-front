export interface AuthResponse {
  token: string;
  userId: string;
  name: string;
  email: string;
  locale: string;
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number | null;
  plate: string | null;
  fuelType: string;
  createdAt: string;
}

export interface FuelFillUp {
  id: string;
  vehicleId: string;
  vehicleLabel: string;
  date: string;
  odometerKm: number;
  totalLiters: number;
  pricePerLiter: number;
  totalCost: number;
  fuelType: string;
  fullTank: boolean;
  notes: string | null;
  createdAt: string;
}

export interface MaintenanceSchedule {
  id: string;
  vehicleId: string;
  vehicleLabel: string;
  type: string;
  description: string | null;
  nextKm: number | null;
  nextDate: string | null;
  intervalKm: number | null;
  intervalMonths: number | null;
  createdAt: string;
}

export interface MaintenanceExpense {
  id: string;
  vehicleId: string;
  vehicleLabel: string;
  date: string;
  category: string;
  description: string;
  cost: number;
  odometerKm: number | null;
  notes: string | null;
  createdAt: string;
}

export interface FuelReport {
  totalCost: number;
  totalLiters: number;
  avgPricePerLiter: number;
  avgKmPerLiter: number;
  costPerKm: number;
  totalKm: number;
  fillUps: FuelFillUp[];
}

export interface MaintenanceReport {
  totalCost: number;
  costByCategory: Record<string, number>;
  expenses: MaintenanceExpense[];
}

export interface ConsolidatedReport {
  totalFuelCost: number;
  totalMaintenanceCost: number;
  grandTotal: number;
  totalKm: number;
  allInCostPerKm: number;
}

export interface MaintenanceTemplate {
  type: string;
  label: string;
  defaultIntervalKm: number | null;
  defaultIntervalMonths: number | null;
}
