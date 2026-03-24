import { FormEvent, useEffect, useState } from 'react';
import { PRODUCT_CATEGORIES, Product, ProductInput } from '../../../shared/types/product';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { PackagePlus } from 'lucide-react';

interface ProductFormProps {
    initialValue?: Product | null;
    onSubmit: (input: ProductInput) => Promise<void>;
    onCancelEdit?: () => void;
}

const defaultProduct: ProductInput = {
    name: '',
    description: '',
    price: 0,
    category: 'Outros',
    stockQuantity: 0,
};

export function ProductForm({ initialValue, onSubmit, onCancelEdit }: ProductFormProps) {
    const [formState, setFormState] = useState<ProductInput>(defaultProduct);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof ProductInput, string>>>({});
    const [priceInput, setPriceInput] = useState('');
    const [stockInput, setStockInput] = useState('');

    function parsePrice(value: string): number {
        const normalized = value
            .trim()
            .replace(/\s/g, '')
            .replace(',', '.')
            .replace(/[^\d.]/g, '');

        if (!normalized) {
            return 0;
        }

        const firstDotIndex = normalized.indexOf('.');
        const safeNumberString =
            firstDotIndex === -1
                ? normalized
                : normalized.slice(0, firstDotIndex + 1) + normalized.slice(firstDotIndex + 1).replace(/\./g, '');

        const parsed = Number(safeNumberString);
        return Number.isNaN(parsed) ? 0 : parsed;
    }

    useEffect(() => {
        if (!initialValue) {
            setFormState(defaultProduct);
            setPriceInput('');
            setStockInput('');
            return;
        }

        setFormState({
            name: initialValue.name,
            description: initialValue.description,
            price: initialValue.price,
            category: initialValue.category,
            stockQuantity: initialValue.stockQuantity,
        });

        setPriceInput(initialValue.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        setStockInput(String(initialValue.stockQuantity));
    }, [initialValue]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const nextErrors: Partial<Record<keyof ProductInput, string>> = {};
        if (!formState.name.trim()) nextErrors.name = 'Informe o nome do produto';
        if (!formState.description.trim()) nextErrors.description = 'Informe uma descrição';
        if (formState.price < 0) nextErrors.price = 'Preço não pode ser negativo';
        if (formState.stockQuantity < 0) nextErrors.stockQuantity = 'Estoque não pode ser negativo';

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        setErrors({});
        setIsSubmitting(true);
        try {
            await onSubmit(formState);
            if (!initialValue) {
                setFormState(defaultProduct);
                setPriceInput('');
                setStockInput('');
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Card className="p-5">
            <form className="grid gap-4" onSubmit={handleSubmit}>
                <div className="flex items-center gap-2">
                    <div className="rounded-xl bg-brand-100 p-2 text-brand-700">
                        <PackagePlus className="h-4 w-4" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900">{initialValue ? 'Editar produto' : 'Novo produto'}</h2>
                </div>

                <label className="grid gap-1 text-sm font-medium text-slate-600">
                    Nome
                    <input
                        required
                        placeholder="Ex: Arroz tipo 1"
                        aria-invalid={Boolean(errors.name)}
                        value={formState.name}
                        onChange={(event) => setFormState((previous) => ({ ...previous, name: event.target.value }))}
                    />
                    {errors.name && <span className="text-xs font-medium text-red-600">{errors.name}</span>}
                </label>

                <label className="grid gap-1 text-sm font-medium text-slate-600">
                    Descrição
                    <textarea
                        required
                        rows={3}
                        placeholder="Descreva marca, peso e observações"
                        aria-invalid={Boolean(errors.description)}
                        value={formState.description}
                        onChange={(event) => setFormState((previous) => ({ ...previous, description: event.target.value }))}
                    />
                    {errors.description && <span className="text-xs font-medium text-red-600">{errors.description}</span>}
                </label>

                <div className="grid gap-3 md:grid-cols-2">
                    <label className="grid gap-1 text-sm font-medium text-slate-600">
                        Preço (R$)
                        <div className="relative">
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                                R$
                            </span>
                            <input
                                required
                                type="text"
                                inputMode="decimal"
                                placeholder="0,00"
                                aria-invalid={Boolean(errors.price)}
                                className="pl-10 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                value={priceInput}
                                onChange={(event) => {
                                    const nextValue = event.target.value;
                                    setPriceInput(nextValue);
                                    setFormState((previous) => ({ ...previous, price: parsePrice(nextValue) }));
                                }}
                                onBlur={() => {
                                    if (!priceInput.trim()) {
                                        setPriceInput('');
                                        return;
                                    }

                                    setPriceInput(
                                        formState.price.toLocaleString('pt-BR', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }),
                                    );
                                }}
                            />
                        </div>
                        {errors.price && <span className="text-xs font-medium text-red-600">{errors.price}</span>}
                    </label>

                    <label className="grid gap-1 text-sm font-medium text-slate-600">
                        Estoque
                        <input
                            type="text"
                            inputMode="numeric"
                            placeholder="0"
                            required
                            aria-invalid={Boolean(errors.stockQuantity)}
                            className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            value={stockInput}
                            onChange={(event) => {
                                const nextValue = event.target.value.replace(/\D/g, '');
                                setStockInput(nextValue);
                                setFormState((previous) => ({
                                    ...previous,
                                    stockQuantity: nextValue ? Number(nextValue) : 0,
                                }));
                            }}
                        />
                        {errors.stockQuantity && <span className="text-xs font-medium text-red-600">{errors.stockQuantity}</span>}
                    </label>
                </div>

                <label className="grid gap-1 text-sm font-medium text-slate-600">
                    Categoria
                    <select
                        required
                        value={formState.category}
                        onChange={(event) =>
                            setFormState((previous) => ({
                                ...previous,
                                category: event.target.value as ProductInput['category'],
                            }))
                        }
                    >
                        {PRODUCT_CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </label>

                <div className="flex flex-wrap gap-2">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Salvando...' : initialValue ? 'Atualizar produto' : 'Cadastrar produto'}
                    </Button>

                    {initialValue && onCancelEdit && (
                        <Button variant="secondary" type="button" onClick={onCancelEdit}>
                            Cancelar edição
                        </Button>
                    )}
                </div>

                <p className="text-xs text-slate-500">Campos obrigatórios devem ser preenchidos antes de salvar.</p>
            </form>
        </Card>
    );
}
