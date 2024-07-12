
"use client";
import { useState } from 'react';
import Modal from '@/app/ui/CRM/modal';
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Form from '@/app/ui/user_group/create-form';
import { lusitana } from '@/app/ui/font';
import UsersGroupBlock from '@/app/ui/user_group/block';


export default function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>Users Group</h1>
       
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <button onClick={openModal}
                    className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                    <span className="hidden md:block">Adicionar novo grupo</span>
                    <PlusIcon className="h-5 md:ml-4" />
                </button>
                <Modal isOpen={isModalOpen} onClose={closeModal} style={{ zIndex: 1000 }}>
                    <br />
                    <Form />
                </Modal>
                <style jsx>{`
                
                button {
                padding: 10px 20px;
                font-size: 16px;
                cursor: pointer;
                }
            `}</style>
            </div>
       
        </div>
    );
}
