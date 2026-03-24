import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, LogOut, PackageSearch, Store } from 'lucide-react';
import { motion } from 'framer-motion';
import { ComponentType } from 'react';
import { useAuth } from '../../modules/auth/hooks/useAuth';
import { Button } from './ui/Button';
import { cn } from '../lib/cn';

export function AppLayout() {
    const { user, signOut } = useAuth();

    return (
        <div className="min-h-screen md:grid md:grid-cols-[260px_1fr]">
            <aside className="glass border-b border-slate-200 p-4 md:border-b-0 md:border-r md:p-5">
                <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-2xl bg-brand-600 p-2 text-white shadow-soft">
                        <Store className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-medium uppercase text-slate-400">Market Manager</p>
                        <h1 className="text-lg font-semibold text-slate-900">Painel</h1>
                    </div>
                </div>

                <nav className="grid gap-1">
                    <NavItem to="/app/dashboard" icon={LayoutDashboard} label="Dashboard" />
                    <NavItem to="/app/products" icon={PackageSearch} label="Produtos" />
                </nav>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-3">
                    <p className="text-xs text-slate-500">Conta conectada</p>
                    <p className="truncate text-sm font-medium text-slate-800">{user?.displayName ?? user?.email}</p>
                    <Button className="mt-3 w-full" variant="secondary" type="button" onClick={() => signOut()}>
                        <LogOut className="h-4 w-4" />
                        Sair
                    </Button>
                </div>
            </aside>

            <main className="p-4 md:p-6 lg:p-8">
                <header className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
                    <h2 className="text-lg font-semibold text-slate-900">Controle de estoque e preços</h2>
                    <p className="mt-1 text-sm text-slate-500">Monitore produtos, ajustes e saúde do inventário em tempo real.</p>
                </header>

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                    <Outlet />
                </motion.div>
            </main>
        </div>
    );
}

interface NavItemProps {
    to: string;
    label: string;
    icon: ComponentType<{ className?: string }>;
}

function NavItem({ to, label, icon: Icon }: NavItemProps) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                cn(
                    'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition duration-200',
                    isActive
                        ? 'bg-brand-600 text-white shadow-soft'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                )
            }
        >
            <Icon className="h-4 w-4" />
            {label}
        </NavLink>
    );
}
