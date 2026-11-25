import SideNav from '@/app/ui/dashboard/sidenav';
import { getUser } from '@/app/lib/DAL';
import { fetchScreenPermissionsForGroup } from '@/app/lib/users_group/data';

export default async function Layout({ children }: { children: React.ReactNode }) {
    const user = await getUser();
    const allowedScreens = await fetchScreenPermissionsForGroup(user.id_grupo);
    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64">
                <SideNav allowedScreens={allowedScreens} />
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
        </div>
    );
}
