import { useCallback } from "react";

const useMathInput = (ecuacionajax, setEcuacion, setEcuacionajax) => {
  const insertarEnInput = useCallback((valor) => {
    setEcuacion((prev) => prev + valor);
  }, [setEcuacion]);

  const insertarEnAjax = useCallback(
    (valor, cursorOffset = 0) => {
      const input = document.getElementById("miInput");
      if (!input) return;

      const start = input.selectionStart;
      const end = input.selectionEnd;

      const newValue =
        ecuacionajax.slice(0, start) + valor + ecuacionajax.slice(end);
      setEcuacionajax(newValue);

      setTimeout(() => {
        const pos = start + valor.length + cursorOffset;
        input.setSelectionRange(pos, pos);
        input.focus();
      }, 0);
    },
    [ecuacionajax, setEcuacionajax]
  );

  return { insertarEnInput, insertarEnAjax };
};

export default useMathInput;
