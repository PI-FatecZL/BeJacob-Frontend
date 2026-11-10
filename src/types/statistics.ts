export type PaymentMethod = 'PIX' | 'DEBIT' | 'CREDIT' | 'CASH' | null; 

export interface RevenueByPaymentMethod {
    paymentMethod: PaymentMethod;
    total: number;       
    appointments: number;
}

export interface RevenueResponse {
    startDate: string;   
    endDate: string;     
    totalRevenue: number; 
    totalAppointments: number; 
    byPaymentMethod: RevenueByPaymentMethod[];
}