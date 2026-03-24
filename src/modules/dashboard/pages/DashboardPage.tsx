import { ReactNode, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ChartColumn, HandCoins, PackageCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { listProductLogs } from '../../../services/firebase/products';
import { ProductLog } from '../../../shared/types/log';
import { LOW_STOCK_THRESHOLD } from '../../../shared/types/product';
import { useProducts } from '../../products/hooks/useProducts';
import { useAuth } from '../../auth/hooks/useAuth';
import { Card } from '../../../shared/components/ui/Card';
import { Skeleton } from '../../../shared/components/ui/Skeleton';

export function DashboardPage() {
    const { user } = useAuth();
    const { allProducts, isLoading } = useProducts(user?.uid);
    const [logs, setLogs] = useState<ProductLog[]>([]);
    const [isLogsLoading, setIsLogsLoading] = useState(true);

    useEffect(() => {
        if (!user?.uid) {
            setLogs([]);
            setIsLogsLoading(false);
            return;
        }

        setIsLogsLoading(true);
        listProductLogs(user.uid, 10)
            .then(setLogs)
            .catch(() => {
                toast.error('Falha ao carregar histórico do dashboard.');
                setLogs([]);
            })
            .finally(() => setIsLogsLoading(false));
    }, [user?.uid]);

    const summary = useMemo(() => {
        const totalProducts = allProducts.length;
        const totalStockValue = allProducts.reduce((sum, product) => sum + product.price * product.stockQuantity, 0);
        const lowStockProducts = allProducts.filter((product) => product.stockQuantity <= LOW_STOCK_THRESHOLD).length;

        return {
            totalProducts,
            totalStockValue,
            lowStockProducts,
        };
    }, [allProducts]);

    return (
        <div className="page-section">
            <section className="grid gap-4 md:grid-cols-3">
                <MetricCard
                    title="Produtos cadastrados"
                    value={String(summary.totalProducts)}
                    icon={<PackageCheck className="h-5 w-5" />}
                    iconClass="bg-brand-100 text-brand-700"
                />
                <MetricCard
                    title="Valor total em estoque"
                    value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.totalStockValue)}
                    icon={<HandCoins className="h-5 w-5" />}
                    iconClass="bg-emerald-100 text-emerald-700"
                />
                <MetricCard
                    title="Produtos com estoque baixo"
                    value={String(summary.lowStockProducts)}
                    icon={<AlertTriangle className="h-5 w-5" />}
                    iconClass="bg-amber-100 text-amber-700"
                />
            </section>

            <Card className="p-5">
                <div className="mb-3 flex items-center gap-2">
                    <div className="rounded-xl bg-slate-100 p-2 text-slate-700">
                        <ChartColumn className="h-4 w-4" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900">Histórico recente</h2>
                </div>
                {isLogsLoading ? (
                    <div className="grid gap-2">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                ) : logs.length === 0 ? (
                    <p className="text-sm text-slate-500">Ainda não há histórico de alterações.</p>
                ) : (
                    <ul className="grid gap-3">
                        {logs.map((log) => (
                            <li key={log.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                <p className="text-sm font-medium text-slate-800">{log.action} — {log.productName}</p>
                                <span className="mt-1 block text-xs text-slate-500">
                                    {new Date(log.timestamp).toLocaleString('pt-BR')} · {log.userEmail ?? 'Usuário'}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </Card>

            {isLoading && (
                <Card className="p-5">
                    <div className="grid gap-2">
                        <Skeleton className="h-5 w-44" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </Card>
            )}
        </div>
    );
}

interface MetricCardProps {
    title: string;
    value: string;
    icon: ReactNode;
    iconClass: string;
}

function MetricCard({ title, value, icon, iconClass }: MetricCardProps) {
    return (
        <Card className="p-5">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-slate-500">{title}</p>
                    <strong className="text-2xl font-bold text-slate-900">{value}</strong>
                </div>
                <div className={`rounded-2xl p-3 ${iconClass}`}>{icon}</div>
            </div>
        </Card>
    );
}
