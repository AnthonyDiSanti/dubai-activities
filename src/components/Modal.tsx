import {
  useEffect,
  useRef,
  type PropsWithChildren,
  type SyntheticEvent,
} from 'react';

type ModalProps = PropsWithChildren<{
  readonly backdropLabel: string;
  readonly backdropClassName: string;
  readonly className: string;
  readonly descriptionId?: string;
  readonly fallbackFocusId?: string;
  readonly labelId: string;
  readonly onClose: () => void;
}>;

export function Modal({
  backdropLabel,
  backdropClassName,
  children,
  className,
  descriptionId,
  fallbackFocusId,
  labelId,
  onClose,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    if (!dialog.open) dialog.showModal();
    dialog.querySelector<HTMLElement>('[data-dialog-panel]')?.focus();

    return () => {
      document.documentElement.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
      const previousCanReceiveFocus =
        previouslyFocused?.isConnected === true &&
        previouslyFocused !== document.body &&
        previouslyFocused !== document.documentElement;
      if (previousCanReceiveFocus) previouslyFocused.focus();
      else if (fallbackFocusId) document.getElementById(fallbackFocusId)?.focus();
    };
  }, [fallbackFocusId]);

  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    // React owns open state, so native Escape dismissal must flow through onClose.
    event.preventDefault();
    onClose();
  };

  return (
    <dialog
      aria-describedby={descriptionId}
      aria-labelledby={labelId}
      className={`modal ${className}`}
      onCancel={handleCancel}
      ref={dialogRef}
    >
      <button
        aria-label={backdropLabel}
        className={`modal__backdrop ${backdropClassName}`}
        onClick={onClose}
        tabIndex={-1}
        type="button"
      />
      {children}
    </dialog>
  );
}
