export interface WorkTimeShiftType {
  id: string;
  startTime: string;
  endTime: string;
  date: string;
  employeeId: string;
  organizationId: string;
  routeId?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

