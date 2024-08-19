'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserCircleIcon, ComputerDesktopIcon, HashtagIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { updateUser } from '@/app/lib/users/action';
import { useRouter } from 'next/navigation';
import { GroupField, UsersForm } from '@/app/lib/definitions';

export default function Form({ user, groups }: { user: UsersForm; groups: GroupField[] }) {

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        email: '',
        grupo: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const router = useRouter();

    // UseEffect para inicializar o formData com os dados do user
    useEffect(() => {
        if (user) {
            setFormData({
                id: user.id || '',
                name: user.name || '',
                email: user.email || '',
                grupo: user.id_grupo || '', // suposição que `id_group` é o ID do grupo
                password: '' // Mantém a senha em branco por questões de segurança
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = new FormData();
        form.append('name', formData.name);
        form.append('id', formData.id);
        form.append('email', formData.email);
        form.append('grupo', formData.grupo);
        form.append('password', formData.password);

        const response = await updateUser(form);

        if (response.errors) {
            setErrors(response.errors);
        } else {
            router.push('/View/dashboard/users');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                {/* Nome do Cliente */}
                <div className="mb-4">
                    <label htmlFor="name" className="mb-2 block text-sm font-medium">
                        Informe o seu nome
                    </label>
                    <div className="relative">
                        <input type="hidden" id="id" name="id" value={formData.id} />
                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Informe o seu nome"
                            value={formData.name}
                            onChange={handleChange}
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="customer-error"
                        />
                        <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                    {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
                </div>

                {/* Email */}
                <div className="mb-4">
                    <label htmlFor="email" className="mb-2 block text-sm font-medium">
                        Informe o seu e-mail
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Informe o seu e-mail"
                                value={formData.email}
                                onChange={handleChange}
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby="customer-error"
                            />
                            <ComputerDesktopIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                    {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                </div>

                {/* Grupo */}
                <div className="mb-4">
                    <label htmlFor="grupo" className="mb-2 block text-sm font-medium">
                        Informe o grupo do usuario
                    </label>
                    <div className="relative">
                        <select
                            id="grupo"
                            name="grupo"
                            value={formData.grupo}
                            onChange={handleChange}
                            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="group-error"
                        >
                            <option value="" disabled>
                                Selecione um grupo
                            </option>
                            {groups.map((group) => (
                                <option key={group.id_group} value={group.id_group}>
                                    {group.description}
                                </option>
                            ))}
                        </select>
                        <UserGroupIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                    {errors.grupo && <span className="text-red-500 text-sm">{errors.grupo}</span>}
                </div>

                {/* Senha */}
                <fieldset>
                    <legend className="mb-2 block text-sm font-medium">
                        Informe a nova senha
                    </legend>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Informe a nova senha"
                                value={formData.password}
                                onChange={handleChange}
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby="customer-error"
                            />
                            <HashtagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                    {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
                </fieldset>
            </div>
            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href="/View/dashboard/users"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Cancelar
                </Link>
                <Button type="submit">Edit user</Button>
            </div>
        </form>
    );
}
