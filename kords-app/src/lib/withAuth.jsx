import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { isAuthenticated } from '@/utils/auth';

export function withAuth(Component) {
  return function ProtectedComponent(props) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
      const auth = isAuthenticated();
      setIsAuth(auth);  
      
      if (!auth) {
        router.push('/');
      }
      
      setIsLoading(false);
    }, [router]);

    if (isLoading) return <div>Chargement...</div>;
    if (!isAuth) return null;

    return <Component {...props} />;
  };
}