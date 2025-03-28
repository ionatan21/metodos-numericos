import { useState } from "react";
import { metodoSecante, evaluarFuncion } from "./functions";
import Modal from "../Utils/Modal";
import "./Secante.css";

export default function Secante() {
  const [ecuacion, setEcuacion] = useState("sqrt(x)-cos(x)");
  const [x0, setX0] = useState(0);
  const [x1, setX1] = useState(1);
  const [resultados, setResultados] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [explicacion, setExplicacion] = useState("");
  const [isEvaluado, setIsEvaluado] = useState(false);

  const generarExplicacion = () => {
    const fx0 = evaluarFuncion(ecuacion, x0);
    const fx1 = evaluarFuncion(ecuacion, x1);

    const explicacionGenerada = `
      El Método de Secante se utiliza para encontrar la raíz de una función continua. En este caso, tenemos la función f(x) = ${ecuacion}.
      Dados los puntos iniciales X0 = ${x0} y X1 = ${x1}, se calcula el siguiente valor Xn utilizando la fórmula:
      Xn = X1 - (f(X1) * (X1 - X0)) / (f(X1) - f(X0))
      Este proceso se repite iterativamente hasta obtener una aproximación suficiente.
    `;

    setExplicacion(explicacionGenerada);
    setIsModalOpen(true);
  };

  const openModal = () => {
    generarExplicacion();
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const convertirEcuacion = (input) => {
    return input
      .replace(/\\sqrt\{([^}]+)\}/g, "sqrt($1)")
      .replace(/\\cos\(([^)]+)\)/g, "cos($1)")
      .replace(/\\sin\(([^)]+)\)/g, "sin($1)")
      .replace(/\\tan\(([^)]+)\)/g, "tan($1)")
      .replace(/\\pi/g, "pi")
      .replace(/\be\b/g, "e");
  };

  const handleChange = (e) => {
    const ecuacionTransformada = convertirEcuacion(e.target.value);
    setEcuacion(ecuacionTransformada);
  };

  const calcular = () => {
    const { resultados, error } = metodoSecante(
      ecuacion,
      parseFloat(x0),
      parseFloat(x1)
    );
    if (error) {
      setError(error);
      setResultados([]);
      setIsEvaluado(false);
    } else {
      setError(null);
      setResultados(resultados);
      setIsEvaluado(true);
    }
  };

  const insertarEnInput = (valor) => {
    setEcuacion((prev) => prev + valor);
  };

  return (
    <section className="secante-container mt-24 mb-5 transition-all duration-300 animate-fade-in-down">
      <button
        onClick={openModal}
        className="rounded-md mb-4 border-2 transform disabled:opacity-50"
        disabled={!isEvaluado}
      >
        Ver Explicación
      </button>

      <Modal
        isOpen={isModalOpen}
        closeModal={closeModal}
        title="Explicación del Método de Secante"
        explanation={explicacion}
      />
      <div className="p-6 mt-4 max-w-[90vw] mx-auto shadow-md rounded-lg border-1 method-container border-black">
        <h2 className="text-2xl font-bold my-4">Método de Secante</h2>
        <div className="mb-4">
          <label className="block font-semibold">Ecuación:</label>
          <input
            type="text"
            value={ecuacion}
            onChange={handleChange}
            className="border p-2 w-full rounded-lg text-center"
          />
        </div>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            { label: "x²", value: "^2" },
            { label: "√x", value: "sqrt(" },
            { label: "π", value: "pi" },
            { label: "e", value: "e" },
            { label: "sin", value: "sin(" },
            { label: "cos", value: "cos(" },
            { label: "tan", value: "tan(" },
            { label: "ln", value: "ln(" },
            { label: "(", value: "(" },
            { label: ")", value: ")" },
            { label: "^", value: "^" },
            { label: "/", value: "/" },
            { label: "*", value: "*" },
            { label: "+", value: "+" },
            { label: "-", value: "-" },
            { label: "C", value: "clear" },
          ].map((btn) => (
            <button
              key={btn.label}
              className="bg-gray-200 border-1 opacity-80 hover:opacity-100 border-black p-2 rounded hover:bg-gray-300 shadow-md text-black font-semibold"
              onClick={() => {
                if (btn.value === "clear") setEcuacion("");
                else insertarEnInput(btn.value);
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-semibold">Valor X0:</label>
            <input
              type="number"
              value={x0}
              onChange={(e) => setX0(e.target.value)}
              className="border p-2 w-full rounded-lg text-center"
            />
          </div>
          <div>
            <label className="block font-semibold">Valor X1:</label>
            <input
              type="number"
              value={x1}
              onChange={(e) => setX1(e.target.value)}
              className="border p-2 w-full rounded-lg text-center"
            />
          </div>
        </div>
        <button
          onClick={calcular}
          className="bg-gray-400 w-36 border-1 border-black border-e-black shadow-md text-black px-4 py-2 rounded"
        >
          Calcular
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {resultados.length > 0 && (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border p-2">Iteración</th>
                  <th className="border p-2">X0</th>
                  <th className="border p-2">f(X0)</th>
                  <th className="border p-2">X1</th>
                  <th className="border p-2">f(X1)</th>
                  <th className="border p-2">Xn</th>
                  <th className="border p-2">f(Xn)</th>
                  <th className="border p-2">Error Abs</th>
                </tr>
              </thead>
              <tbody>
                {resultados.map(
                  ({ iteracion, x0, fx0, x1, fx1, xn, fxn, errorAbs }) => (
                    <tr key={iteracion}>
                      <td className="border p-2">{iteracion}</td>
                      <td className="border p-2">{x0.toFixed(6)}</td>
                      <td className="border p-2">{fx0.toFixed(6)}</td>
                      <td className="border p-2">{x1.toFixed(6)}</td>
                      <td className="border p-2">{fx1.toFixed(6)}</td>
                      <td className="border p-2">{xn.toFixed(6)}</td>
                      <td className="border p-2">{fxn.toFixed(6)}</td>
                      <td className="border p-2">
                        {errorAbs ? errorAbs.toFixed(6) : "-"}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
