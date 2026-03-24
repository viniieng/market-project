import { useEffect, useMemo, useState } from 'react';
import { Product } from '../../../shared/types/product';
import { subscribeProducts } from '../../../services/firebase/products';

export type ProductSort = 'updatedAt_desc' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';

interface ProductFilters {
    searchTerm: string;
    category: string;
    minPrice: string;
    maxPrice: string;
    sort: ProductSort;
}

const defaultFilters: ProductFilters = {
    searchTerm: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    sort: 'updatedAt_desc',
};

export function useProducts(userId?: string) {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<ProductFilters>(defaultFilters);

    useEffect(() => {
        if (!userId) {
            setProducts([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        const unsubscribe = subscribeProducts(userId, (items) => {
            setProducts(items);
            setIsLoading(false);
        });

        return unsubscribe;
    }, [userId]);

    const filteredProducts = useMemo(() => {
        const min = filters.minPrice ? Number(filters.minPrice) : undefined;
        const max = filters.maxPrice ? Number(filters.maxPrice) : undefined;

        const visible = products.filter((item) => {
            const matchesSearch =
                item.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(filters.searchTerm.toLowerCase());
            const matchesCategory = !filters.category || item.category === filters.category;
            const matchesMin = min === undefined || item.price >= min;
            const matchesMax = max === undefined || item.price <= max;

            return matchesSearch && matchesCategory && matchesMin && matchesMax;
        });

        return visible.sort((a, b) => {
            switch (filters.sort) {
                case 'price_asc':
                    return a.price - b.price;
                case 'price_desc':
                    return b.price - a.price;
                case 'name_asc':
                    return a.name.localeCompare(b.name);
                case 'name_desc':
                    return b.name.localeCompare(a.name);
                case 'updatedAt_desc':
                default:
                    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            }
        });
    }, [filters, products]);

    return {
        products: filteredProducts,
        allProducts: products,
        isLoading,
        filters,
        setFilters,
    };
}
