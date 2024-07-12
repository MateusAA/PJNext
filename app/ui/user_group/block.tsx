

import { fetchGroup } from '@/app/lib/data';

export default async function UsersGroupBlock() {
    const users = await fetchGroup();
    return (
        <div>
            {users?.map((user) => (
                <p key={user.id_group}>{(user.description)}</p>
            ))}
        </div>
    );
}
