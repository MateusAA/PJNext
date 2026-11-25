'use client';

import { useState, useTransition } from 'react';
import { submitCustomerLead } from '@/app/lib/customers/public-action';
import { useCepLookup, type CepAddress } from '@/app/ui/customers/use-cep-lookup';

const inputClass = 'mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100';

export default function PublicCustomerForm() {
    const [documentType, setDocumentType] = useState<'cpf' | 'cnpj'>('cpf');
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [isPending, startTransition] = useTransition();
    const { lookupCep, cepLookupStatus } = useCepLookup();
    const [address, setAddress] = useState<CepAddress & { cep: string; numero: string }>({
        cep: '', rua: '', numero: '', bairro: '', cidade: '', uf: '',
    });

    function handleAddressChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.currentTarget;
        setAddress((current) => ({ ...current, [name]: value }));
        if (name === 'cep') {
            void lookupCep(value, (foundAddress) => {
                setAddress((current) => ({ ...current, ...foundAddress }));
            });
        }
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        formData.set('documentType', documentType);
        setMessage('');
        startTransition(async () => {
            const result = await submitCustomerLead(formData);
            setSuccess(result.success);
            setMessage(result.success
                ? 'Cadastro enviado. Nossa equipe vai analisar as informações e entrar em contato.'
                : result.message ?? 'Não foi possível enviar o cadastro.');
            if (result.success) {
                form.reset();
                setAddress({ cep: '', rua: '', numero: '', bairro: '', cidade: '', uf: '' });
                setDocumentType('cpf');
            }
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-7">
            {success ? (
                <div role="status" className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-900">{message}</div>
            ) : message ? (
                <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{message}</div>
            ) : null}

            <div>
                <span className="text-sm font-medium text-gray-900">Tipo de cadastro</span>
                <div className="mt-2 flex gap-3">
                    {(['cpf', 'cnpj'] as const).map((type) => (
                        <button key={type} type="button" onClick={() => setDocumentType(type)} aria-pressed={documentType === type}
                            className={`rounded-lg border px-4 py-2 text-sm font-medium ${documentType === type ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                            {type.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            <section className="space-y-4">
                <h2 className="text-base font-semibold text-gray-900">Dados do cliente</h2>
                {documentType === 'cpf' ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="text-sm font-medium text-gray-700 sm:col-span-2">Nome completo *<input className={inputClass} name="name" autoComplete="name" required maxLength={160} /></label>
                        <label className="text-sm font-medium text-gray-700">CPF *<input className={inputClass} name="cpf" inputMode="numeric" autoComplete="off" required maxLength={14} placeholder="000.000.000-00" /></label>
                        <label className="text-sm font-medium text-gray-700">RG<input className={inputClass} name="rg" maxLength={30} /></label>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="text-sm font-medium text-gray-700">Razão social *<input className={inputClass} name="razao_social" required maxLength={200} /></label>
                        <label className="text-sm font-medium text-gray-700">Nome fantasia *<input className={inputClass} name="nome_fantasia" required maxLength={200} /></label>
                        <label className="text-sm font-medium text-gray-700">CNPJ *<input className={inputClass} name="cnpj" inputMode="numeric" autoComplete="off" required maxLength={18} placeholder="00.000.000/0000-00" /></label>
                        <label className="text-sm font-medium text-gray-700">Inscrição estadual<input className={inputClass} name="ie" maxLength={30} /></label>
                    </div>
                )}
            </section>

            <section className="space-y-4">
                <h2 className="text-base font-semibold text-gray-900">Contato</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    <label className="text-sm font-medium text-gray-700">E-mail *<input className={inputClass} type="email" name="email" autoComplete="email" required maxLength={254} /></label>
                    <label className="text-sm font-medium text-gray-700">Telefone *<input className={inputClass} type="tel" name="tel_cel" autoComplete="tel" required maxLength={30} placeholder="(00) 00000-0000" /></label>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-base font-semibold text-gray-900">Endereço</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    <label className="text-sm font-medium text-gray-700">CEP *<input className={inputClass} name="cep" value={address.cep} onChange={handleAddressChange} autoComplete="postal-code" inputMode="numeric" required maxLength={10} placeholder="00000-000" /></label>
                    <label className="text-sm font-medium text-gray-700">Rua *<input className={inputClass} name="rua" value={address.rua} onChange={handleAddressChange} autoComplete="address-line1" required maxLength={200} /></label>
                    <label className="text-sm font-medium text-gray-700">Número *<input className={inputClass} name="numero" value={address.numero} onChange={handleAddressChange} required maxLength={30} /></label>
                    <label className="text-sm font-medium text-gray-700">Bairro *<input className={inputClass} name="bairro" value={address.bairro} onChange={handleAddressChange} autoComplete="address-level3" required maxLength={120} /></label>
                    <label className="text-sm font-medium text-gray-700">Cidade *<input className={inputClass} name="cidade" value={address.cidade} onChange={handleAddressChange} autoComplete="address-level2" required maxLength={120} /></label>
                    <label className="text-sm font-medium text-gray-700">UF *<input className={inputClass} name="uf" value={address.uf} onChange={handleAddressChange} autoComplete="address-level1" required minLength={2} maxLength={2} /></label>
                </div>
                {cepLookupStatus && <p role="status" className="text-xs text-gray-600">{cepLookupStatus}</p>}
            </section>

            <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
            </div>

            <button type="submit" disabled={isPending} className="w-full rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60">
                {isPending ? 'Enviando cadastro…' : 'Enviar cadastro'}
            </button>
            <p className="text-center text-xs text-gray-500">Os dados enviados serão usados para analisar seu cadastro e retornar seu contato.</p>
        </form>
    );
}
