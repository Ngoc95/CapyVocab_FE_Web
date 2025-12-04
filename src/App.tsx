import { RouterProvider } from 'react-router';
import { router } from './utils/newRoutes';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}
