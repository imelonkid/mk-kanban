export interface Service {
  id: string;
  name: string;
  description: string;
  url: string;
  status: 'online' | 'offline' | 'maintenance';
  icon?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export type ServiceFormData = Omit<Service, 'id' | 'createdAt' | 'updatedAt'>; 