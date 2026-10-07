import { RouterProvider } from 'react-router';
import { Toaster } from '~/components/ui/toast';
import { useTheme } from '~/hooks/use-theme';
import router from '~/router';

function App() {
  useTheme();

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
