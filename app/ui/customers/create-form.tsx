    'use client';

    import { CustomerField, UsersForm, UsersRespon } from '@/app/lib/definitions';
    import Link from 'next/link';
    import React, { useState, useRef, useEffect } from 'react';
    import InputMask from 'react-input-mask';
    import {
        CheckIcon,
        ClockIcon,
        CurrencyDollarIcon,
        UserCircleIcon,
        PowerIcon,
        BanknotesIcon,
        CogIcon,
        CubeIcon,
        MapIcon,
        PhoneIcon,
        IdentificationIcon
    } from '@heroicons/react/24/outline';
    import { Button } from '@/app/ui/button';
    import { CreateCustomer } from '@/app/lib/customers/action';
    import { useRouter } from 'next/navigation';
    import { useFormState } from 'react-dom';


type FormErrors = {
    cpf?: string[];
    cnpj?: string[];
    nome?: string[];
    razao_social?: string[];
    rg?: string[];
    ie?: string[];
    image?: string[];
    [key: string]: string[] | undefined;
};

export default function Form({ usersVender }: { usersVender: UsersRespon[] }) {


        const [documentType, setDocumentType] = useState('cpf');

        const [formData, setFormData] = useState({
            documentType: 'cpf',
            cpf: '',
            cnpj: '',
            nome: '',
            razao_social: '',
            nome_fantasia: '',
            rg: '',
            ie: '',
            image: null as File | null,
            cep: '',
            rua: '',
            numero: '',
            bairro: '',
            cidade: '',
            uf: '',
            responsavel: '',
            tel_cel: '',
            email: ''

        });

    const [errors, setErrors] = useState<FormErrors>({});
        const [globalError, setGlobalError] = useState<string | null>(null);
        const errorRef = useRef<HTMLDivElement | null>(null);
        
        const router = useRouter();

        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const { name, value } = e.target;

            if (e.target instanceof HTMLInputElement && e.target.type === 'file') {
                const files = e.target.files;
                if (files && files.length > 0) {
                    // Se for um campo de arquivo, use files[0]
                    setFormData({
                        ...formData,
                        [name]: files[0]
                    });
                }
            } else {
                setFormData({
                    ...formData,
                    [name]: value
                });
            }
        };

        const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
            e.preventDefault();
            setGlobalError(null);

            const formCustomer = new FormData();
            formCustomer.append('cpf', formData.cpf)
            formCustomer.append('cnpj', formData.cnpj);
            formCustomer.append('nome', formData.nome);
            formCustomer.append('razao_social', formData.razao_social);
            formCustomer.append('nome_fantasia', formData.nome_fantasia);
            formCustomer.append('rg', formData.rg);
            formCustomer.append('ie', formData.ie);
            if (formData.image) {
                formCustomer.append('image', formData.image); // Adicione a imagem apenas se existir
            }
            const formAndress = new FormData();
            formAndress.append('cep', formData.cep);
            formAndress.append('rua', formData.rua);
            formAndress.append('numero', formData.numero);
            formAndress.append('bairro', formData.bairro);
            formAndress.append('cidade', formData.cidade);
            formAndress.append('uf', formData.uf);

            const formContact = new FormData();
            formContact.append('responsavel', formData.responsavel);
            formContact.append('tel_cel', formData.tel_cel);
            formContact.append('email', formData.email);

            const formInput = new FormData();
            formInput.append('documentType', formData.documentType);

            const response = await CreateCustomer(
                formInput,
                formCustomer,
                formAndress,
                formContact
            );



            if (response.message) {
                // Exibe mensagem geral de erro
                setGlobalError(response.message || 'Erro ao enviar o formulário.');
            }

            if (response.errors) {
                const mappedErrors: FormErrors = {};
                const errors = response.errors as { [key: string]: string[] };

                Object.keys(errors).forEach((key) => {
                    const errorMessages = errors[key];
                    // Mantenha `errorMessages` como um array de strings
                    mappedErrors[key] = Array.isArray(errorMessages) ? errorMessages : [errorMessages];
                });

                setErrors(mappedErrors);
            }


        };

        // Rola a página até o elemento de mensagem de erro quando a mensagem de erro é definida
        useEffect(() => {
            if (globalError && errorRef.current) {
                errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, [globalError]);

        return (
            <form onSubmit={handleSubmit}>
                <div className="rounded-md bg-gray-50 p-4 md:p-6">
                    {globalError  && (
                        <div  ref={errorRef} className="bg-red-500 text-white p-4 mb-4 rounded">
                            {globalError}
                        </div>
                    )}
                    {/* Document Type Selection */}
                    <hr className='border border-black-1000' />
                    <br />
                    <p className='text-xl text-center'>Dados do cliente</p>
                    <br />
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="flex-1">
                            <label htmlFor="documentType" className="mb-2 block text-sm font-medium">
                                Tipo de documento
                            </label>
                            <div className="relative mt-2 rounded-md">
                                <select
                                    id="documentType"
                                    name="documentType"
                                    className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                    value={documentType}
                                    onChange={(e) => {
                                        setDocumentType(e.target.value);
                                        setFormData({
                                            ...formData,
                                            documentType: e.target.value,
                                        });
                                    }}
                                >
                                    <option value="cpf" >CPF</option>
                                    <option value="cnpj">CNPJ</option>
                                </select>
                                <CogIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />

                            </div>

                        </div>


                        {/* Conditional Document Input */}
                        <div className="flex-1">
                            {documentType === 'cpf' ? (
                                <div>
                                    <label htmlFor="cpf" className="mb-2 block text-sm font-medium">
                                        CPF
                                    </label>
                                    <div className="relative">
                                        <InputMask
                                            mask="999.999.999-99"
                                            id="cpf"
                                            name="cpf"
                                            value={formData.cpf}
                                            onChange={handleChange}
                                            className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                            placeholder="Enter CPF"

                                        />
                                        <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                                    </div>
                                    {errors.cpf && <span className="text-red-500 text-sm">{errors.cpf}</span>}
                                </div>
                            ) : (
                                <div>
                                    <label htmlFor="cnpj" className="mb-2 block text-sm font-medium">
                                        CNPJ
                                    </label>
                                    <div className="relative">
                                        <InputMask
                                            mask="99.999.999/9999-99"
                                            id="cnpj"
                                            name="cnpj"
                                            value={formData.cnpj}
                                            onChange={handleChange}
                                            className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                            placeholder="Enter CNPJ"
                                        />
                                        <BanknotesIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                                    </div>
                                    {errors.cnpj && <span className="text-red-500 text-sm">{errors.cnpj}</span>}
                                </div>

                            )}

                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        {/* Conditional Document Input */}
                        <div className="flex-1">
                            {documentType === 'cpf' ? (
                                <div>
                                    <label htmlFor="cpf" className="mb-2 block text-sm font-medium">
                                        Nome
                                    </label>
                                    <div className="relative">
                                        <InputMask
                                            mask=""
                                            id="nome"
                                            name="nome"
                                            value={formData.nome}
                                            onChange={handleChange}
                                            className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                            placeholder="Nome"

                                        />
                                        <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                                    </div>
                                    {errors.nome && <span className="text-red-500 text-sm">{errors.nome}</span>}

                                </div>
                            ) : (
                                <div className="flex flex-col md:flex-row gap-4 mb-4">
                                    <div className="flex-1">
                                        <label htmlFor="cnpj" className="mb-2 block text-sm font-medium">
                                            Razão Social
                                        </label>
                                        <div className="relative">
                                            <InputMask
                                                mask=""
                                                id="razao_social"
                                                name="razao_social"
                                                value={formData.razao_social}
                                                onChange={handleChange}
                                                className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                                placeholder="Razão Social"
                                            />
                                            <BanknotesIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                                        </div>
                                        {errors.razao_social && <span className="text-red-500 text-sm">{errors.razao_social}</span>}

                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="cnpj" className="mb-2 block text-sm font-medium">
                                            Nome Fantasia
                                        </label>
                                        <div className="relative">
                                            <InputMask
                                                mask=""
                                                id="nome_fantasia"
                                                name="nome_fantasia"
                                                value={formData.nome_fantasia}
                                                onChange={handleChange}
                                                className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                                placeholder="Nome Fantasia"
                                            />
                                            <BanknotesIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                                        </div>
                                        {errors.nome_fantasia && <span className="text-red-500 text-sm">{errors.nome_fantasia}</span>}

                                    </div>
                                </div>
                            )}
                        </div>
                    <div className="flex-1">
                        {documentType === 'cpf' ? (
                            <div>
                                <label htmlFor="cpf" className="mb-2 block text-sm font-medium">
                                    RG
                                </label>
                                <div className="relative">
                                    <InputMask
                                        mask="99.999.999-9"
                                        id="rg"
                                        name="rg"
                                        value={formData.rg}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                        placeholder="Registro Geral"
                                    />
                                    <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                                </div>
                                {errors.rg && <span className="text-red-500 text-sm">{errors.rg}</span>}

                            </div>
                        ) : (
                            <div>
                                <label htmlFor="cnpj" className="mb-2 block text-sm font-medium">
                                    Inscrição Estadual
                                </label>
                                <div className="relative">
                                    <InputMask
                                        mask="999.999.999.999"
                                        id="ie"
                                        name="ie"
                                        value={formData.ie}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                        placeholder="Inscrição Estadual"

                                    />

                                    <BanknotesIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                                </div>
                                {errors.ie && <span className="text-red-500 text-sm">{errors.ie}</span>}

                            </div>
                        )}
                    </div>
                </div>


                {/* Invoice Image */}
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1">
                        <label htmlFor="image" className="mb-2 block text-sm font-medium">
                            Upload Image (PNG)
                        </label>
                        <div className="relative mt-2 rounded-md">
                            <input
                                id="image"
                                name="image"
                                onChange={handleChange}
                                type="file"
                                accept=".png"
                                className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-gray-100 file:text-gray-700
                            hover:file:bg-gray-200"
                            />
                        </div>
                    </div>
                </div>
                <br />
                <hr className='border border-black-900' />
                <br />
                <p className='text-xl text-center'>Dados do endereço</p>
                <br />
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1">
                        <label htmlFor="documentType" className="mb-2 block text-sm font-medium">
                            CEP
                        </label>
                        <div className="relative mt-2 rounded-md">
                            <InputMask
                                id="cep"
                                name="cep"
                                value={formData.cep}
                                onChange={handleChange}
                                className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                mask="99999-999"
                                placeholder="CEP - 00000-000"
                            />

                            <MapIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />

                        </div>
                        {errors.cep && <span className="text-red-500 text-sm">{errors.cep}</span>}

                    </div>
                    <div className="flex-1">
                        <label htmlFor="documentType" className="mb-2 block text-sm font-medium">
                            Rua
                        </label>
                        <div className="relative mt-2 rounded-md">
                            <input
                                id="rua"
                                name="rua"
                                value={formData.rua}
                                onChange={handleChange}
                                className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                placeholder="Avenida - Rua - Estrada"
                            />

                            <MapIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />

                        </div>
                        {errors.rua && <span className="text-red-500 text-sm">{errors.rua}</span>}

                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-2">
                        <label htmlFor="documentType" className="mb-2 block text-sm font-medium">
                            Numero
                        </label>
                        <div className="relative mt-2 rounded-md">
                            <input
                                id="numero"
                                name="numero"
                                value={formData.numero}
                                onChange={handleChange}
                                className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                placeholder="0000"
                            />

                            <MapIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />

                        </div>
                        {errors.numero && <span className="text-red-500 text-sm">{errors.numero}</span>}

                    </div>
                    <div className="flex-1">
                        <label htmlFor="documentType" className="mb-2 block text-sm font-medium">
                            Bairro
                        </label>
                        <div className="relative mt-2 rounded-md">
                            <input
                                id="bairro"
                                name="bairro"
                                value={formData.bairro}
                                onChange={handleChange}
                                className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                placeholder="Jardim - Vila - Portal"
                            />

                            <MapIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />

                        </div>
                        {errors.bairro && <span className="text-red-500 text-sm">{errors.bairro}</span>}

                    </div>
                    <div className="flex-2">
                        <label htmlFor="documentType" className="mb-2 block text-sm font-medium">
                            Cidade
                        </label>
                        <div className="relative mt-2 rounded-md">
                            <input
                                id="cidade"
                                name="cidade"
                                value={formData.cidade}
                                onChange={handleChange}
                                className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                placeholder="São Paulo"
                            />

                            <MapIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />

                        </div>
                        {errors.cidade && <span className="text-red-500 text-sm">{errors.cidade}</span>}

                    </div>
                    <div className="flex-2">
                        <label htmlFor="documentType" className="mb-2 block text-sm font-medium">
                            UF
                        </label>
                        <div className="relative mt-2 rounded-md">
                            <input
                                id="uf"
                                name="uf"
                                value={formData.uf}
                                onChange={handleChange}
                                className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                placeholder="SP - RJ - PR"
                            />

                            <MapIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />

                        </div>
                        {errors.uf && <span className="text-red-500 text-sm">{errors.uf}</span>}

                    </div>
                </div>
                <br />
                <hr className='border border-black-900' />
                <br />
                <p className='text-xl text-center'>Dados de contato</p>
                <br />
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1">
                        <label htmlFor="documentType" className="mb-2 block text-sm font-medium">
                            Resposanvel pelo Cliente
                        </label>
                        <div className="relative mt-2 rounded-md">
                            <select
                                id="responsavel"
                                name="responsavel"
                                value={formData.responsavel}
                                onChange={handleChange}
                                className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            >
                                <option value=" " >Selecione um responsavel</option>
                                {usersVender.map((response) => (
                                    <option key={response.id} value={response.id}>
                                        {response.name}
                                    </option>
                                ))}
                            </select>
                            <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />

                        </div>
                        {errors.id_responsavel && <span className="text-red-500 text-sm">{errors.id_responsavel}</span>}

                    </div>
                    <div className="flex-2">
                        <label htmlFor="documentType" className="mb-2 block text-sm font-medium">
                            Telefone
                        </label>
                        <div className="relative mt-2 rounded-md">
                            <InputMask
                                id="tel_cel"
                                name="tel_cel"
                                value={formData.tel_cel}
                                onChange={handleChange}
                                className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                mask="(99) 99999-9999"
                                placeholder='(99) 99999-9999'
                            />

                            <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />

                        </div>
                        {errors.tel_cel && <span className="text-red-500 text-sm">{errors.tel_cel}</span>}

                    </div>
                    <div className="flex-1">
                        <label htmlFor="documentType" className="mb-2 block text-sm font-medium">
                            E-mail
                        </label>
                        <div className="relative mt-2 rounded-md">
                            <InputMask
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                mask=""
                                placeholder='@nextmail.com'
                            />

                            <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />

                        </div>
                        {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}

                    </div>
                </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href="/View/dashboard/customers"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Cancelar
                </Link>
                <Button type="submit">Criar Cliente</Button>
            </div>
        </form >

    );
}
