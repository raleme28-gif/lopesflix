import "./index.scss";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children?: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {

    return (
        isOpen && (

            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3>{title}</h3>
                        <button className="close-button" onClick={onClose}>
                            &times;
                        </button>
                    </div>
                    <div className="modal-body">{children}</div>
                </div>
            </div>
        )
    )
};

