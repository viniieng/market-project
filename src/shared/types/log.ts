export type ProductLogAction = 'CREATE' | 'UPDATE' | 'DELETE';

export interface ProductLog {
    id: string;
    productId: string;
    productName: string;
    action: ProductLogAction;
    timestamp: string;
    userId: string;
    userEmail?: string | null;
}
