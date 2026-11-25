'use client';

import { useState, useTransition } from 'react';
import { XMarkIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import { updateGroupScreenPermissions } from '@/app/lib/users_group/action';

const screens = [
    { href: '/View/dashboard', label: 'Início' },
    { href: '/View/dashboard/invoices', label: 'Faturas' },
    { href: '/View/dashboard/users', label: 'Usuários' },
    { href: '/View/dashboard/users_group', label: 'Grupos de usuários' },
    { href: '/View/dashboard/customers', label: 'Clientes' },
    { href: '/View/dashboard/aprovacao', label: 'Aprovação' },
    { href: '/View/dashboard/contato', label: 'Contatos' },
    { href: '/View/dashboard/charContato', label: 'Dash Contatos' },
];

export default function GroupScreensModal({
    id,
    description,
    initialScreens,
}: {
    id: string;
    description: string;
    initialScreens: string[];
}) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(initialScreens);
    const [message, setMessage] = useState('');
    const [isPending, startTransition] = useTransition();

    function toggleScreen(href: string) {
        setSelected((current) => current.includes(href)
            ? current.filter((screen) => screen !== href)
            : [...current, href]);
    }

    function savePermissions(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData();
        selected.forEach((screen) => formData.append('screens', screen));
        startTransition(async () => {
            const result = await updateGroupScreenPermissions(id, formData);
            setMessage(result.message ?? '');
            if (result.message === 'Permissões das telas salvas.') setOpen(false);
        });
    }

    return (
        <>
            <button
                type="button"
                onClick={() => { setMessage(''); setOpen(true); }}
                aria-label={`Configurar telas do grupo ${description}`}
                title="Configurar telas"
                className="rounded-md border p-2 text-blue-700 hover:bg-blue-50"
            >
                <Squares2X2Icon className="w-5" />
            </button>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onMouseDown={(event) => {
                    if (event.target === event.currentTarget) setOpen(false);
                }}>
                    <section role="dialog" aria-modal="true" aria-labelledby={`screens-title-${id}`} className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                        <div className="mb-5 flex items-start justify-between gap-4">
                            <div>
                                <h2 id={`screens-title-${id}`} className="text-xl font-semibold text-gray-900">Telas do grupo</h2>
                                <p className="mt-1 text-sm text-gray-500">{description}</p>
                            </div>
                            <button type="button" onClick={() => setOpen(false)} aria-label="Fechar" className="rounded p-1 text-gray-500 hover:bg-gray-100">
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={savePermissions}>
                            <fieldset className="grid gap-3 sm:grid-cols-2">
                                <legend className="sr-only">Telas permitidas para este grupo</legend>
                                {screens.map((screen) => (
                                    <label key={screen.href} className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm hover:bg-gray-50">
                                        <input
                                            type="checkbox"
                                            checked={selected.includes(screen.href)}
                                            onChange={() => toggleScreen(screen.href)}
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        {screen.label}
                                    </label>
                                ))}
                            </fieldset>
                            {message && <p role="status" className="mt-4 text-sm text-red-700">{message}</p>}
                            <div className="mt-6 flex justify-end gap-3">
                                <button type="button" onClick={() => setOpen(false)} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50">Cancelar</button>
                                <button type="submit" disabled={isPending} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50">
                                    {isPending ? 'Salvando…' : 'Salvar permissões'}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </>
    );
}
