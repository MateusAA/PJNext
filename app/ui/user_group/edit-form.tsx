'use client';

import { useState, useEffect } from 'react';
import { useFormState } from 'react-dom';
import Link from 'next/link';
import { UserCircleIcon, ComputerDesktopIcon, HashtagIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { updateUserGroup } from '@/app/lib/users_group/action';
import { useRouter } from 'next/navigation';
import { GroupField } from '@/app/lib/definitions';
import { RectangleGroupIcon } from '@heroicons/react/24/solid';

export default function Form({ groups }: { groups: GroupField }) {

    const initialState = { message: null, errors: {} };
    const [state, dispatch] = useFormState(updateUserGroup, initialState);

    return (
        <form action={dispatch}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                {/* Nome do Cliente */}
                <div className="mb-4">
                    <label htmlFor="name" className="mb-2 block text-sm font-medium">
                        Informe a descrição do grupo
                    </label>
                        <input type="hidden" id="id_group" name="id_group" value={groups.id_group} />
                    <div className="relative">
                        <input
                            id="description"
                            name="description"
                            type="text"
                            defaultValue={groups.description}
                            placeholder="Informe a descrição"
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="customer-error"
                        />
                        <RectangleGroupIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                    <div id="customer-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.description &&
                            state.errors.description.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>                </div>


            </div>
            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href="/View/dashboard/users_group"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Cancelar
                </Link>
                <Button type="submit">Criar Grupo de usuários</Button>
            </div>
        </form>
    );
}

