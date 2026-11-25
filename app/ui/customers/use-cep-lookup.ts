'use client';

import { useRef, useState } from 'react';

export type CepAddress = {
    rua: string;
    bairro: string;
    cidade: string;
    uf: string;
};

type ViaCepResponse = {
    logradouro?: string;
    bairro?: string;
    localidade?: string;
    uf?: string;
    erro?: boolean;
};

export function useCepLookup() {
    const requestId = useRef(0);
    const [status, setStatus] = useState('');

    async function lookupCep(value: string, onAddressFound: (address: CepAddress) => void) {
        const cep = value.replace(/\D/g, '');
        const currentRequest = ++requestId.current;

        if (cep.length !== 8) {
            setStatus('');
            return;
        }

        setStatus('Consultando CEP…');

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            if (!response.ok) throw new Error('CEP lookup failed');

            const result: ViaCepResponse = await response.json();
            if (currentRequest !== requestId.current) return;

            if (result.erro) {
                setStatus('CEP não encontrado. Preencha o endereço manualmente.');
                return;
            }

            onAddressFound({
                rua: result.logradouro ?? '',
                bairro: result.bairro ?? '',
                cidade: result.localidade ?? '',
                uf: result.uf ?? '',
            });
            setStatus('Endereço encontrado. Confira e informe o número.');
        } catch {
            if (currentRequest === requestId.current) {
                setStatus('Não foi possível consultar o CEP. Preencha o endereço manualmente.');
            }
        }
    }

    return { lookupCep, cepLookupStatus: status };
}
