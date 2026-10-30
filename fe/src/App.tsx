import {
  type DefaultError,
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { RouterProvider } from 'react-router';
import { Toaster, toast } from '~/components/ui/toast';
import { useTheme } from '~/hooks/use-theme';
import { isSessionExpiredError } from '~/lib/axios';
import router from '~/router';

const showApiError = (error: DefaultError) => {
  if (isSessionExpiredError(error)) return;

  toast.add({
    type: 'error',
    title: error.response?.data?.message ?? error.message ?? 'Something went wrong',
    description: 'CODE: ' + (error.response?.data?.errorCode ?? 'UNKNOWN'),
  });
};

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (!query.meta?.skipGlobalError) showApiError(error);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (!mutation.meta?.skipGlobalError) showApiError(error);
    },
  }),
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

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
