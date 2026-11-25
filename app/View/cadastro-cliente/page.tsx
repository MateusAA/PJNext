import type { Metadata } from 'next';
import PublicCustomerForm from '@/app/ui/customers/public-customer-form';

export const metadata: Metadata = {
    title: 'Cadastro de cliente',
    description: 'Preencha seus dados para solicitar seu cadastro como cliente.',
};

export default function CustomerRegistrationPage() {
    return (
        <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:py-16">
            <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm sm:p-10">
                <div className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Cadastro de cliente</p>
                    <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">Solicite seu cadastro</h1>
                    <p className="mt-3 text-sm leading-6 text-gray-600">Preencha os dados abaixo. Nossa equipe receberá sua solicitação para análise.</p>
                </div>
                <PublicCustomerForm />
            </div>
        </main>
    );
}
