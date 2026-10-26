import { Outlet } from 'react-router';
import { AppSidebar } from '~/components/app-sidebar';
import { SiteHeader } from '~/components/site-header';
import { SidebarInset, SidebarProvider } from '~/components/ui/sidebar';

export default function SidebarLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className='min-w-0'>
        <SiteHeader />
        <div className='min-w-0 flex-1 p-4'>
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
