import { PRODUCT_CATEGORIES } from '../../../shared/types/product';
import { ProductSort } from '../hooks/useProducts';
import { Card } from '../../../shared/components/ui/Card';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button';

interface ProductFiltersProps {
    values: {
        searchTerm: string;
        category: string;
        minPrice: string;
        maxPrice: string;
        sort: ProductSort;
    };
    onChange: (next: ProductFiltersProps['values']) => void;
}

export function ProductFilters({ values, onChange }: ProductFiltersProps) {
    function handleReset() {
        onChange({
            searchTerm: '',
            category: '',
            minPrice: '',
            maxPrice: '',
            sort: 'updatedAt_desc',
        });
    }

    return (
        <Card className="p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                    <div className="rounded-xl bg-brand-100 p-2 text-brand-700">
                        <SlidersHorizontal className="h-4 w-4" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Busca e filtros</h2>
                        <p className="text-xs text-slate-500">Refine os resultados por texto, categoria e preço.</p>
                    </div>
                </div>
                <Button variant="ghost" type="button" onClick={handleReset}>
                    Limpar filtros
                </Button>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                <label className="grid gap-1 text-sm font-medium text-slate-600">
                    Buscar
                    <input
                        placeholder="Nome ou descrição"
                        value={values.searchTerm}
                        onChange={(event) => onChange({ ...values, searchTerm: event.target.value })}
                    />
                </label>

                <label className="grid gap-1 text-sm font-medium text-slate-600">
                    Categoria
                    <select
                        value={values.category}
                        onChange={(event) => onChange({ ...values, category: event.target.value })}
                    >
                        <option value="">Todas</option>
                        {PRODUCT_CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="grid gap-1 text-sm font-medium text-slate-600">
                    Preço mínimo
                    <input
                        type="number"
                        min={0}
                        step="0.01"
                        value={values.minPrice}
                        onChange={(event) => onChange({ ...values, minPrice: event.target.value })}
                    />
                </label>

                <label className="grid gap-1 text-sm font-medium text-slate-600">
                    Preço máximo
                    <input
                        type="number"
                        min={0}
                        step="0.01"
                        value={values.maxPrice}
                        onChange={(event) => onChange({ ...values, maxPrice: event.target.value })}
                    />
                </label>

                <label className="grid gap-1 text-sm font-medium text-slate-600">
                    Ordenação
                    <select
                        value={values.sort}
                        onChange={(event) => onChange({ ...values, sort: event.target.value as ProductSort })}
                    >
                        <option value="updatedAt_desc">Última atualização</option>
                        <option value="price_asc">Preço (menor primeiro)</option>
                        <option value="price_desc">Preço (maior primeiro)</option>
                        <option value="name_asc">Nome (A-Z)</option>
                        <option value="name_desc">Nome (Z-A)</option>
                    </select>
                </label>
            </div>
        </Card>
    );
}
