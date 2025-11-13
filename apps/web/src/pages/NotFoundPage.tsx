/**
 * NotFoundPage Component
 * 404 error page
 */

import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Home, AlertCircle } from 'lucide-react';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="flex items-center justify-center h-full bg-gray-100">
        <EmptyState
          icon={<AlertCircle className="w-20 h-20 text-red-500" />}
          title="Página não encontrada"
          description="A página que você está procurando não existe ou foi removida."
          action={
            <Button onClick={() => navigate('/')} variant="primary">
              <Home className="w-4 h-4 mr-2" />
              Voltar para Home
            </Button>
          }
        />
      </div>
    </Layout>
  );
}

export default NotFoundPage;
