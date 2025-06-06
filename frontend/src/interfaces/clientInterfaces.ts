export interface Client {
  clientId: number;
  clientName: string;
  enabled: boolean;
  createdAt: string;
}

export interface CreateClientPayload {
  clientName: string;
}

export interface UpdateClientPayload {
  clientName?: string;
  enabled?: boolean;
}
