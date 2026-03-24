export type ProductCategory = 'Hortifruti' | 'Bebidas' | 'Padaria' | 'Limpeza' | 'Frios' | 'Mercearia' | 'Outros';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: ProductCategory;
    stockQuantity: number;
    createdAt: string;
    updatedAt: string;
}

export interface ProductInput {
    name: string;
    description: string;
    price: number;
    category: ProductCategory;
    stockQuantity: number;
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
    'Hortifruti',
    'Bebidas',
    'Padaria',
    'Limpeza',
    'Frios',
    'Mercearia',
    'Outros',
];

export const LOW_STOCK_THRESHOLD = 10;
