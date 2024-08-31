'use client';

import { CustomersForm, UsersRespon } from '@/app/lib/definitions';
import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';
import InputMask from 'react-input-mask';
import { AprovCustomers, ReprovCustomers } from '@/app/ui/invoices/buttons';

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
import { UpdateCustomer } from '@/app/lib/customers/action';
import { useRouter } from 'next/navigation';
import { useFormState } from 'react-dom';

export default function Form({ customer, usersVender }: { customer: CustomersForm, usersVender: UsersRespon[] }) {

    console.log(customer);

const aprov_id = '1';
const rep_id = '2';

    //Inicio do processo de criação do cliente
    let [documentType, setDocumentType] = useState('cpf');


    let [formData, setFormData] = useState({
        id: '',
        nameRes: '',
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


    //Inicio do processo edit do cliente

    // UseEffect para inicializar o formData com os dados do user
    useEffect(() => {
        if (customer) {
            setFormData({
                documentType: 'cpf',
                id: customer.id || '',
                nome: customer.name || '',
                email: customer.email || '',
                cpf: customer.cpf || '', // suposição que `id_group` é o ID do grupo
                rg: customer.rg || '', // suposição que `id_group` é o ID do grupo
                razao_social: customer.razao_social || '', // suposição que `id_group` é o ID do grupo
                nome_fantasia: customer.nome_fantasia || '', // suposição que `id_group` é o ID do grupo
                cnpj: customer.cnpj || '', // suposição que `id_group` é o ID do grupo
                ie: customer.ie || '', // suposição que `id_group` é o ID do grupo
                tel_cel: customer.tel_cel || '', // suposição que `id_group` é o ID do grupo
                rua: customer.rua || '', // suposição que `id_group` é o ID do grupo
                numero: customer.numero || '', // suposição que `id_group` é o ID do grupo
                bairro: customer.bairro || '', // suposição que `id_group` é o ID do grupo
                cidade: customer.cidade || '', // Mantém a senha em branco por questões de segurança
                uf: customer.uf || '', // Mantém a senha em branco por questões de segurança
                cep: customer.cep || '', // Mantém a senha em branco por questões de segurança
                responsavel: customer.id_responsavel || '', // Mantém a senha em branco por questões de segurança
                nameRes: customer.nameRes || '', // Mantém a senha em branco por questões de segurança
                image: null, 
            });
        }
    }, [customer]);

    if (customer.cnpj != null){
        documentType = 'cnpj';
    }


    const [errors, setErrors] = useState({});
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

    


    return (
        <div>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
              
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
                                        disabled
                                    />
                                    <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                                </div>
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
                                        disabled
                                    />
                                    <BanknotesIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                                </div>
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
                                        disabled
                                    />
                                    <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                                </div>
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
                                            disabled
                                        />
                                        <BanknotesIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                                    </div>
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
                                            disabled
                                        />
                                        <BanknotesIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                                    </div>
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
                                        disabled
                                    />
                                    <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                                </div>
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
                                        disabled
                                    />
                                    <BanknotesIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                                </div>
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
                                disabled
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
                                disabled
                            />
                            <MapIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                        </div>
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
                                disabled
                            />
                            <MapIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                        </div>
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
                                disabled
                            />
                            <MapIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                        </div>
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
                                disabled
                            />
                            <MapIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                        </div>
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
                                disabled
                            />
                            <MapIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                        </div>
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
                                disabled
                            />

                            <MapIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />

                        </div>
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
                                disabled
                            >
                                <option value="" disabled>Selecione um responsavel</option>
                                {usersVender.map((response) => (
                                    <option key={response.id} value={response.id}>
                                        {response.name}
                                    </option>
                                ))}
                            </select>
                            <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />

                        </div>
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
                                disabled
                            />

                            <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />

                        </div>
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
                                disabled
                            />

                            <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />

                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
                
                <AprovCustomers id={customer.id} status_id={aprov_id}/>
                <ReprovCustomers id={customer.id} status_id={rep_id} />
            </div>
        </div >

    );
}
