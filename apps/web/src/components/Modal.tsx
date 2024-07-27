import React, {
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  MutableRefObject,
} from 'react';

interface ModalProps {
  id: string;
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
  closeButton?: boolean;
  scrollable?: boolean;
  actions?: React.ReactNode[];
}

const getFullWidthRespectingScrollbarInVw = () => {
  const viewportWidth = window.innerWidth;
  const scrollbarWidth = viewportWidth - document.documentElement.clientWidth;
  return `calc(100% - ${scrollbarWidth <= 1 ? 0 : scrollbarWidth}px)`;
};

const Modal = forwardRef<HTMLDialogElement, ModalProps>(
  (
    {
      id,
      show,
      onClose,
      children,
      closeButton = true,
      scrollable = false,
      actions,
    },
    ref,
  ) => {
    const localRef = useRef<HTMLDialogElement | null>(null);
    const modalRef = ref
      ? (ref as MutableRefObject<HTMLDialogElement | null>)
      : localRef;

    const handleClickOutside = useCallback(
      (event: MouseEvent) => {
        if (
          modalRef.current &&
          !modalRef.current.contains(event.target as Node)
        ) {
          onClose();
        }
      },
      [onClose, modalRef],
    );

    useEffect(() => {
      const currentRef = modalRef.current;
      if (show) {
        document.addEventListener('mousedown', handleClickOutside);
        currentRef?.showModal();
      } else {
        document.removeEventListener('mousedown', handleClickOutside);
        currentRef?.close();
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [show, handleClickOutside, modalRef]);

    useEffect(() => {
      if (modalRef.current) {
        modalRef.current.style.width = getFullWidthRespectingScrollbarInVw();
      }
    }, [modalRef]);

    return (
      <dialog
        id={id}
        className={`modal ${scrollable ? 'overflow-y-auto' : ''}`}
        ref={modalRef}
      >
        <div
          className={`modal-box relative ${scrollable ? 'max-h-[90%]' : ''}`}
        >
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={onClose}
            >
              ✕
            </button>
          </form>
          <div className="modal-content">{children}</div>
          <div className="flex flex-wrap gap-2 justify-end">
            {actions && <div className="modal-action">{actions}</div>}
            {!actions && closeButton && (
              <div className="modal-action">
                <form method="dialog">
                  <button className="btn btn-error" onClick={onClose}>
                    Close
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={onClose}>close</button>
        </form>
      </dialog>
    );
  },
);

export default Modal;
