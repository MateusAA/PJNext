
"use client";
import { useState } from 'react';
import Modal from '@/app/ui/CRM/modal';
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';


export default function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div>
            <button onClick={openModal} 
          className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
>
          <span className="hidden md:block">Abrir Modal</span>
          <PlusIcon className="h-5 md:ml-4" />
          </button>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <h2>Este é um Modal!</h2>
                <p>Você pode colocar qualquer conteúdo aqui.</p>
            </Modal>
            <style jsx>{`
        div {
          display: flex;
        }
        button {
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
        }
      `}</style>
        </div>
    );
}
