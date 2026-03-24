import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../../../shared/components/ui/Button';

export function LoginPage() {
    const { isAuthenticated, signInWithGoogle, isLoading } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleLogin() {
        try {
            setIsSubmitting(true);
            await signInWithGoogle();
            toast.success('Login realizado com sucesso.');
        } catch {
            toast.error('Não foi possível entrar com Google.');
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) {
        return <div className="grid min-h-screen place-items-center text-sm text-slate-500">Carregando...</div>;
    }

    if (isAuthenticated) {
        return <Navigate to="/app" replace />;
    }

    return (
        <main className="grid min-h-screen place-items-center p-4">
            <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="glass w-full max-w-md rounded-2xl border border-slate-200 p-8 shadow-soft"
            >
                <div className="mb-6 flex items-center gap-2 text-brand-700">
                    <Sparkles className="h-5 w-5" />
                    <span className="text-sm font-medium">Plataforma Premium</span>
                </div>

                <h1 className="text-3xl font-bold text-slate-900">Market Manager</h1>
                <p className="mt-2 text-sm text-slate-500">Gerencie estoque, preços e operações com uma experiência moderna e segura.</p>

                <Button className="mt-6 w-full" onClick={handleLogin} type="button" disabled={isSubmitting}>
                    <ShieldCheck className="h-4 w-4" />
                    {isSubmitting ? 'Entrando...' : 'Entrar com Google'}
                </Button>

                <p className="mt-4 text-center text-xs text-slate-400">Acesso restrito para usuários autenticados.</p>
            </motion.section>
        </main>
    );
}
