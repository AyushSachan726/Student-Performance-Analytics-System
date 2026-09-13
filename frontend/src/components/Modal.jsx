import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-backdrop-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-dialog-light"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-light">
              <h2>{title}</h2>
              <button
                type="button"
                className="modal-close-btn"
                onClick={onClose}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="modal-body-light">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
