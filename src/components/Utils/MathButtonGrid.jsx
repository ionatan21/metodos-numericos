const MathButtonGrid = ({
  insertarEnInput,
  insertarEnAjax,
  setEcuacion,
  setEcuacionajax,
  enfocarInput,
}) => {
  const buttons = [
    { label: "x²", value: "^2", latex: "^{2}" },
    { label: "√x", value: "sqrt(x)", latex: " \\sqrt{x}" },
    { label: "π", value: "pi", latex: " \\pi " },
    { label: "e", value: "e", latex: " e " },
    { label: "sin", value: "sin(", latex: " \\sin(" },
    { label: "cos", value: "cos(", latex: " \\cos(" },
    { label: "tan", value: "tan(", latex: " \\tan(" },
    { label: "ln", value: "ln(", latex: " \\ln(" },
    { label: "(", value: "(", latex: "(" },
    { label: ")", value: ")", latex: ")" },
    { label: "^", value: "^", latex: "^{}" },
    { label: "/", value: "/", latex: "/" },
    { label: "*", value: "*", latex: "*" }, // Multiplicación en LaTeX
    { label: "+", value: "+", latex: "+" },
    { label: "-", value: "-", latex: "-" },
    { label: "C", value: "clear", latex: " " }, // Limpiar
  ];

  const handleClick = (btn) => {
    if (btn.value === "clear") {
      setEcuacion("");
      setEcuacionajax(" ");
      enfocarInput?.(); // Solo si la función existe
    } else if (btn.value === "^") {
      insertarEnInput(btn.value);
      insertarEnAjax("^{}", -1); // Puedes ajustar aquí si necesitas mover cursor
    } else {
      insertarEnInput(btn.value);
      insertarEnAjax(btn.latex);
      enfocarInput?.();
    }
  };

  return (
    <div className="grid grid-cols-4 gap-2 mb-4">
      {buttons.map((btn) => (
        <button
          key={btn.label}
          className="bg-gray-200 border border-black p-2 rounded hover:bg-gray-300 opacity-80 hover:opacity-100 shadow-md text-black font-semibold"
          onClick={() => handleClick(btn)}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
};

export default MathButtonGrid;
