import { Outlet } from 'react-router';

export default function SidebarLayout() {
  return (
    <div className='grid grid-cols-12'>
      <div className='col-span-2'>sidebar</div>
      <div className='col-span-10'>
        <Outlet />
      </div>
    </div>
  );
}
