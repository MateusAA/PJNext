export function normalizeCpf(value: string) {
    return value.replace(/\D/g, '');
}

export function normalizeCnpj(value: string) {
    return value.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function calculateCheckDigit(base: string, weights: number[]) {
    const sum = Array.from(base).reduce((total, character, index) => {
        return total + (character.charCodeAt(0) - 48) * weights[index];
    }, 0);
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
}

export function isValidCpf(value: string) {
    const cpf = normalizeCpf(value);
    if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false;

    const firstDigit = calculateCheckDigit(cpf.slice(0, 9), [10, 9, 8, 7, 6, 5, 4, 3, 2]);
    const secondDigit = calculateCheckDigit(`${cpf.slice(0, 9)}${firstDigit}`, [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);
    return cpf.endsWith(`${firstDigit}${secondDigit}`);
}

export function isValidCnpj(value: string) {
    const cnpj = normalizeCnpj(value);
    if (!/^[A-Z0-9]{12}\d{2}$/.test(cnpj) || /^(.)\1{13}$/.test(cnpj)) return false;

    const firstDigit = calculateCheckDigit(cnpj.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
    const secondDigit = calculateCheckDigit(`${cnpj.slice(0, 12)}${firstDigit}`, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
    return cnpj.endsWith(`${firstDigit}${secondDigit}`);
}
