"use client";
import {
    BanknotesIcon,
    ClockIcon,
    UserGroupIcon,
    PlusIcon,
    MinusIcon,
    DivideIcon
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

const iconMap = {
    positivo: PlusIcon,
    neutro: DivideIcon,
    negativo: MinusIcon,
};

export default function CardWrapper({ data }: { data: Array<{ responsavel: string, description: string, desc: string }> }) {
    const [positiveCount, setPositiveCount] = useState(0);
    const [neutralCount, setNeutralCount] = useState(0);
    const [negativeCount, setNegativeCount] = useState(0);

    useEffect(() => {
        if (data && data.length > 0) {
            const posCount = data.filter((item) => item.desc === "Positivo").length;
            const neuCount = data.filter((item) => item.desc === "Neutro").length;
            const negCount = data.filter((item) => item.desc === "Negativo").length;

            setPositiveCount(posCount);
            setNeutralCount(neuCount);
            setNegativeCount(negCount);
        }
    }, [data]);

    return (
        <>
            <Card title="Positivo" value={positiveCount} type="positivo" />
            <Card title="Neutro" value={neutralCount} type="neutro" />
            <Card title="Negativo" value={negativeCount} type="negativo" />
        </>
    );
}

function Card({
    title,
    value,
    type,
}: {
    title: string;
    value: number | string;
    type: 'positivo' | 'neutro' | 'negativo';
}) {
    const Icon = iconMap[type];

    return (
        <div className="rounded-xl bg-gray-50 p-4 shadow-sm w-100"> {/* Aumente a largura aqui */}
            <div className="flex items-center mb-4">
                {Icon ? <Icon className="h-6 w-6 text-gray-700" /> : null}
                <h3 className="ml-2 text-sm font-medium">{title}</h3>
            </div>
            <p className="truncate rounded-xl bg-white px-4 py-8 text-center text-2xl">
                {value}
            </p>
        </div>
    );
}
