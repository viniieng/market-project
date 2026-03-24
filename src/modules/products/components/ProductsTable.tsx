import { LOW_STOCK_THRESHOLD, Product } from '../../../shared/types/product';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { AlertTriangle, PackageSearch } from 'lucide-react';

interface ProductsTableProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => Promise<void>;
}

export function ProductsTable({ products, onEdit, onDelete }: ProductsTableProps) {
    if (products.length === 0) {
        return (
            <Card className="p-10 text-center">
                <div className="mx-auto mb-3 w-fit rounded-2xl bg-brand-100 p-3 text-brand-700">
                    <PackageSearch className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Nenhum produto encontrado</h2>
                <p className="mt-1 text-sm text-slate-500">Cadastre um novo item ou ajuste os filtros para visualizar resultados.</p>
            </Card>
        );
    }

    return (
        <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <h2 className="text-lg font-semibold text-slate-900">Produtos</h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{products.length} itens</span>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                            <th className="px-5 py-3">Nome</th>
                            <th className="px-5 py-3">Categoria</th>
                            <th className="px-5 py-3">Preço</th>
                            <th className="px-5 py-3">Estoque</th>
                            <th className="px-5 py-3">Atualizado em</th>
                            <th className="px-5 py-3 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => {
                            const isLow = product.stockQuantity <= LOW_STOCK_THRESHOLD;

                            return (
                                <tr
                                    key={product.id}
                                    className={isLow ? 'bg-amber-50/60 transition duration-200 hover:bg-amber-50' : 'transition duration-200 hover:bg-slate-50'}
                                >
                                    <td className="px-5 py-4">
                                        <p className="font-semibold text-slate-900">{product.name}</p>
                                        <p className="mt-1 max-w-sm text-xs text-slate-500">{product.description}</p>
                                    </td>
                                    <td className="px-5 py-4 text-slate-600">{product.category}</td>
                                    <td className="px-5 py-4 font-medium text-slate-700">
                                        {new Intl.NumberFormat('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL',
                                        }).format(product.price)}
                                    </td>
                                    <td className="px-5 py-4">
                                        {isLow ? (
                                            <span className="inline-flex items-center gap-1 rounded-lg bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">
                                                <AlertTriangle className="h-3.5 w-3.5" />
                                                {product.stockQuantity} un
                                            </span>
                                        ) : (
                                            <span className="rounded-lg bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800">
                                                {product.stockQuantity} un
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-5 py-4 text-slate-500">{new Date(product.updatedAt).toLocaleString('pt-BR')}</td>
                                    <td className="px-5 py-4">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="secondary" type="button" onClick={() => onEdit(product)}>
                                                Editar
                                            </Button>
                                            <Button variant="danger" type="button" onClick={() => onDelete(product)}>
                                                Excluir
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
