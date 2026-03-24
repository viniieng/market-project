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

    useEffect(() => {
        if (!initialValue) {
            setFormState(defaultProduct);
            return;
        }

        setFormState({
            name: initialValue.name,
            description: initialValue.description,
            price: initialValue.price,
            category: initialValue.category,
            stockQuantity: initialValue.stockQuantity,
        });
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
                        <input
                            min={0}
                            step="0.01"
                            type="number"
                            required
                            aria-invalid={Boolean(errors.price)}
                            value={formState.price}
                            onChange={(event) =>
                                setFormState((previous) => ({ ...previous, price: Number(event.target.value) }))
                            }
                        />
                        {errors.price && <span className="text-xs font-medium text-red-600">{errors.price}</span>}
                    </label>

                    <label className="grid gap-1 text-sm font-medium text-slate-600">
                        Estoque
                        <input
                            min={0}
                            step="1"
                            type="number"
                            required
                            aria-invalid={Boolean(errors.stockQuantity)}
                            value={formState.stockQuantity}
                            onChange={(event) =>
                                setFormState((previous) => ({ ...previous, stockQuantity: Number(event.target.value) }))
                            }
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
