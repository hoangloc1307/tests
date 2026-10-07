import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router';
import { Toaster } from '~/components/ui/toast';
import { useTheme } from '~/hooks/use-theme';
import router from '~/router';

const queryClient = new QueryClient();

function App() {
  useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
