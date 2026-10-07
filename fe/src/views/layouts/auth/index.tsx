import { Outlet } from 'react-router';
import banner from '~/assets/images/VNN_Building.jpg';
import { Card, CardContent } from '~/components/ui/card';

export default function AuthLayout() {
  return (
    <div className='bg-muted flex min-h-svh items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-sm md:max-w-4xl'>
        <div className='flex flex-col gap-6'>
          <Card className='overflow-hidden p-0'>
            <CardContent className='grid p-0 md:grid-cols-2'>
              <div className='bg-primary/15 hidden rounded-l-sm md:block'>
                <img src={banner} alt='Banner' className='h-full w-full object-contain' />
              </div>
              <Outlet />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
