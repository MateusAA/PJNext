'use client';

import { useEffect, useState } from 'react';
import { ClockIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { fetchCustomerContactHistory } from '@/app/lib/contato/action';
import { FormattedContactCustomersTable } from '@/app/lib/definitions';

type ContactHistory = Awaited<ReturnType<typeof fetchCustomerContactHistory>>;

export default function ContactHistoryModal({
  customer,
  onClose,
  onRegisterReturn,
}: {
  customer: FormattedContactCustomersTable;
  onClose: () => void;
  onRegisterReturn: () => void;
}) {
  const [history, setHistory] = useState<ContactHistory | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    fetchCustomerContactHistory(customer.id)
      .then((result) => {
        if (isMounted) setHistory(result);
      })
      .catch(() => {
        if (isMounted) setError(true);
      });

    return () => {
      isMounted = false;
    };
  }, [customer.id]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const customerName = customer.name || customer.nome_fantasia || 'Cliente';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-0 sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-history-title"
        className="flex h-full w-full max-w-3xl flex-col overflow-hidden bg-white shadow-2xl sm:h-auto sm:max-h-[90vh] sm:rounded-2xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-5 sm:px-7">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-semibold text-blue-800">
              {customerName.slice(0, 1).toLocaleUpperCase('pt-BR')}
            </div>
            <div className="min-w-0">
              <h2 id="contact-history-title" className="truncate text-lg font-semibold text-gray-900 sm:text-xl">
                {customerName}
              </h2>
              <p className="truncate text-sm text-gray-500">{customer.email || 'E-mail não informado'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar histórico"
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </header>

        <div className="grid gap-3 bg-gray-50 px-5 py-4 sm:grid-cols-3 sm:px-7">
          <div className="rounded-xl bg-white p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Telefone</p>
            <p className="mt-1 truncate text-sm font-medium text-gray-900">{customer.tel_cel || 'Não informado'}</p>
          </div>
          <div className="rounded-xl bg-white p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Responsável</p>
            <p className="mt-1 truncate text-sm font-medium text-gray-900">
              {history?.responsible || 'Não informado'}
            </p>
          </div>
          <div className="rounded-xl bg-white p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Contatos registrados</p>
            <p className="mt-1 text-sm font-medium text-gray-900">{customer.contact_count}</p>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7">
          <div className="mb-4 flex items-center gap-2">
            <ClockIcon className="h-5 w-5 text-blue-700" />
            <h3 className="font-semibold text-gray-900">Histórico de contatos</h3>
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
              Não foi possível carregar o histórico. Tente fechar e abrir novamente.
            </p>
          )}

          {!history && !error && (
            <div className="space-y-3" aria-label="Carregando histórico">
              {[0, 1, 2].map((item) => (
                <div key={item} className="animate-pulse rounded-xl border border-gray-100 p-4">
                  <div className="mb-3 h-4 w-40 rounded bg-gray-200" />
                  <div className="mb-2 h-3 w-full rounded bg-gray-100" />
                  <div className="h-3 w-2/3 rounded bg-gray-100" />
                </div>
              ))}
            </div>
          )}

          {history && history.contacts.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 px-5 py-10 text-center">
              <p className="font-medium text-gray-800">Ainda não há contatos registrados.</p>
              <p className="mt-1 text-sm text-gray-500">Registre o primeiro retorno para iniciar o histórico.</p>
            </div>
          )}

          {history && history.contacts.length > 0 && (
            <ol className="space-y-4">
              {history.contacts.map((contact, index) => (
                <li key={`${contact.created_at}-${index}`} className="relative rounded-xl border border-gray-200 p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800">
                        {contact.treatment_description}
                      </span>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                        {contact.return_description}
                      </span>
                    </div>
                    <time className="text-xs text-gray-500" dateTime={contact.created_at}>
                      {new Date(contact.created_at).toLocaleString('pt-BR', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </time>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">{contact.message}</p>
                </li>
              ))}
            </ol>
          )}
        </div>

        <footer className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Fechar
          </button>
          <button
            type="button"
            onClick={onRegisterReturn}
            className="h-10 rounded-lg bg-blue-700 px-4 text-sm font-medium text-white hover:bg-blue-600"
          >
            Registrar retorno
          </button>
        </footer>
      </section>
    </div>
  );
}
