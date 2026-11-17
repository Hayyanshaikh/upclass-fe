import { useRef } from "react";

type SwipeToDismissOptions = {
  onDismiss: () => void;
  threshold?: number;
  sheetSelector?: string;
};

const RESET_TRANSITION_MS = 180;

export function useSwipeToDismiss({
  onDismiss,
  threshold = 80,
  sheetSelector = ".ant-drawer-content-wrapper",
}: SwipeToDismissOptions) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number | null>(null);
  const dragY = useRef(0);

  const getSheet = () =>
    triggerRef.current?.closest<HTMLElement>(sheetSelector) ?? null;

  const resetSheet = (sheet: HTMLElement) => {
    sheet.style.transition = `transform ${RESET_TRANSITION_MS}ms ease`;
    sheet.style.transform = "";
    window.setTimeout(() => {
      sheet.style.transition = "";
    }, RESET_TRANSITION_MS + 20);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    startY.current = event.clientY;
    dragY.current = 0;

    const sheet = getSheet();
    if (sheet) sheet.style.transition = "none";
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (startY.current === null) return;

    dragY.current = Math.max(0, event.clientY - startY.current);

    const sheet = getSheet();
    if (sheet) sheet.style.transform = `translateY(${dragY.current}px)`;
  };

  const onPointerUp = () => {
    if (startY.current === null) return;

    const sheet = getSheet();
    const shouldDismiss = dragY.current > threshold;

    startY.current = null;
    dragY.current = 0;

    if (sheet) resetSheet(sheet);
    if (shouldDismiss) onDismiss();
  };

  const onPointerCancel = () => {
    if (startY.current === null) return;

    const sheet = getSheet();

    startY.current = null;
    dragY.current = 0;

    if (sheet) resetSheet(sheet);
  };

  return {
    triggerRef,
    triggerProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
    },
  };
}
