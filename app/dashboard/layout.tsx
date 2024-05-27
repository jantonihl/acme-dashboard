import SideNav from '@/app/ui/dashboard/sidenav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="md:flex.row flex h-screen flex-col md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-group p-6 md:overflow-y-auto md:p-12">
        {children}{' '}
      </div>
    </div>
  );
}
