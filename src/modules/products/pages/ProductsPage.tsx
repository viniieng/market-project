import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Boxes, CircleDollarSign, TriangleAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../auth/hooks/useAuth';
import { ProductForm } from '../components/ProductForm';
import { ProductFilters } from '../components/ProductFilters';
import { ProductsTable } from '../components/ProductsTable';
import { useProducts } from '../hooks/useProducts';
import { createProduct, removeProduct, updateProduct } from '../../../services/firebase/products';
import { LOW_STOCK_THRESHOLD, Product, ProductInput } from '../../../shared/types/product';
import { Card } from '../../../shared/components/ui/Card';
import { Skeleton } from '../../../shared/components/ui/Skeleton';

export function ProductsPage() {
    const { user } = useAuth();
    const { products, allProducts, filters, setFilters, isLoading } = useProducts(user?.uid);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const lowStockCount = useMemo(
        () => allProducts.filter((product) => product.stockQuantity <= LOW_STOCK_THRESHOLD).length,
        [allProducts],
    );
    const stockValue = useMemo(
        () => allProducts.reduce((total, product) => total + product.price * product.stockQuantity, 0),
        [allProducts],
    );

    async function handleSubmit(input: ProductInput) {
        if (!user) return;

        try {
            if (selectedProduct) {
                await updateProduct(selectedProduct.id, input, user);
                toast.success('Produto atualizado com sucesso.');
                setSelectedProduct(null);
                return;
            }

            await createProduct(input, user);
            toast.success('Produto cadastrado com sucesso.');
        } catch {
            toast.error('Não foi possível salvar o produto.');
        }
    }

    async function handleDelete(product: Product) {
        if (!user) return;

        const confirmed = window.confirm(`Deseja excluir o produto "${product.name}"?`);

        if (!confirmed) return;

        try {
            await removeProduct(product, user);
            toast.success('Produto removido com sucesso.');
        } catch {
            toast.error('Falha ao remover produto.');
        }
    }

    return (
        <div className="page-section">
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Card className="p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500">Total de produtos</p>
                            <strong className="text-3xl font-bold text-slate-900">{allProducts.length}</strong>
                        </div>
                        <div className="rounded-2xl bg-brand-100 p-3 text-brand-700">
                            <Boxes className="h-5 w-5" />
                        </div>
                    </div>
                </Card>
                <Card className="p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500">Itens com estoque baixo</p>
                            <strong className="text-3xl font-bold text-slate-900">{lowStockCount}</strong>
                        </div>
                        <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
                            <TriangleAlert className="h-5 w-5" />
                        </div>
                    </div>
                </Card>

                <Card className="p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500">Valor em estoque</p>
                            <strong className="text-2xl font-bold text-slate-900">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stockValue)}
                            </strong>
                        </div>
                        <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                            <CircleDollarSign className="h-5 w-5" />
                        </div>
                    </div>
                </Card>
            </section>

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                <ProductForm
                    initialValue={selectedProduct}
                    onSubmit={handleSubmit}
                    onCancelEdit={() => setSelectedProduct(null)}
                />
            </motion.div>

            <ProductFilters values={filters} onChange={setFilters} />

            {isLoading ? (
                <Card className="p-5">
                    <div className="grid gap-3">
                        <Skeleton className="h-8 w-56" />
                        <Skeleton className="h-14 w-full" />
                        <Skeleton className="h-14 w-full" />
                        <Skeleton className="h-14 w-full" />
                    </div>
                </Card>
            ) : (
                <ProductsTable products={products} onEdit={setSelectedProduct} onDelete={handleDelete} />
            )}
        </div>
    );
}
