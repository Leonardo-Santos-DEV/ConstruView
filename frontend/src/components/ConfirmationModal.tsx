import React from 'react';
import { Modal } from './Modal';
import { FiAlertTriangle } from 'react-icons/fi';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  isConfirming?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
                                                                      isOpen,
                                                                      onClose,
                                                                      onConfirm,
                                                                      title,
                                                                      message,
                                                                      confirmButtonText = 'Confirmar',
                                                                      cancelButtonText = 'Cancelar',
                                                                      isConfirming = false,
                                                                    }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <FiAlertTriangle size={48} className="text-red-400" />
        </div>
        <p className="text-slate-300 text-lg">{message}</p>
        <div className="flex justify-center gap-4 mt-8">
          <button
            type="button"
            onClick={onClose}
            disabled={isConfirming}
            className="px-6 py-2 text-sm font-semibold text-white bg-sky-700 hover:bg-sky-600 rounded-md transition-colors disabled:opacity-50"
          >
            {cancelButtonText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            className="px-6 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors disabled:opacity-50"
          >
            {isConfirming ? 'Confirmando...' : confirmButtonText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
