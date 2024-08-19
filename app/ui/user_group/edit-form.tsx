'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserCircleIcon, ComputerDesktopIcon, HashtagIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { updateUserGroup } from '@/app/lib/users_group/action';
import { useRouter } from 'next/navigation';
import { GroupField } from '@/app/lib/definitions';
import { RectangleGroupIcon } from '@heroicons/react/24/solid';

export default function Form({ groups }: { groups: GroupField }) {

    const [formData, setFormData] = useState({
        id_group:'',
        description: '',
    });
    const [errors, setErrors] = useState({});
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    useEffect(() => {
        if (groups) {
            setFormData({
                description: groups.description || '',
                id_group: groups.id_group || '',
               
            });
        }
    }, [groups]);


    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData();
        form.append('id_group', formData.id_group);
        form.append('description', formData.description);


        const response = await updateUserGroup(form);

       
    };

    return (

        <form onSubmit={handleSubmit}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                {/* Nome do Cliente */}
                <div className="mb-4">
                    <label htmlFor="name" className="mb-2 block text-sm font-medium">
                        Informe a descrição do grupo
                    </label>
                    <div className="relative">
                        <input type="hidden" id="id_group" name="id_group" value={formData.id_group} />
                        <input
                            id="description"
                            name="description"
                            type="text"
                            placeholder="Informe a descrição"
                            value={formData.description}
                            onChange={handleChange}
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="customer-error"
                        />
                        <RectangleGroupIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                    {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}
                </div>


            </div>
            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href="/View/dashboard/users_group"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Cancelar
                </Link>
                <Button type="submit">Edit</Button>
            </div>
        </form>
    );
}
