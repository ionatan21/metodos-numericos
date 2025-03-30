import { useState } from "react";
import { metodoBiseccion, evaluarFuncion } from "./functions";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import Modal from "../Utils/Modal";
import "./Biseccion.css";

export default function Biseccion() {
  const [ecuacion, setEcuacion] = useState("sqrt(x)-cos(x)");
  const [ecuacionajax, setEcuacionajax] = useState(" \\sqrt{x} -  \\cos(x)");

  const [a, setA] = useState(0);
  const [b, setB] = useState(1);
  const [resultados, setResultados] = useState([]);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [explicacion, setExplicacion] = useState("");
  const [isEvaluado, setIsEvaluado] = useState(false); // Estado para controlar la evaluación
  const [mathJaxKey, setMathJaxKey] = useState(0);

  const generarExplicacion = () => {
    // Evaluamos la función en los puntos a y b
    const fa = evaluarFuncion(ecuacion, a);
    const fb = evaluarFuncion(ecuacion, b);
    const fxi = evaluarFuncion(ecuacion, (a + b) / 2).toFixed(6);
    let newa = 0;
    let newb = 0;

    if (fa * fxi < 0) {
      newa = a;
      newb = (a + b) / 2;
    } else {
      newa = (a + b) / 2;
      newb = b;
    }

    if (fa === null || fb === null) {
      setError("Error al evaluar la función en los puntos dados.");
      return;
    }

    // Generar la explicación teórica con los valores actuales
    const explicacionGenerada = `
      El Método de Bisección se utiliza para encontrar la raíz de una función continua. En este caso, tenemos la función f(x) = ${ecuacion}.
      //
      1. Dado el intervalo [a, b] = [${a}, ${b}], tenemos los siguientes valores:
      //
      f(a) = ${fa.toFixed(6)}
      //
      f(b) = ${fb.toFixed(6)}
      //
      2. Sabemos que el método de bisección requiere que f(a) y f(b) tengan signos opuestos, lo cual es necesario para garantizar que exista una raíz en el intervalo.
      //
      En cada iteración, calculamos el punto Xi como la mitad del intervalo:
      //
      Xi = (a + b) / 2 = ${(a + b) / 2}
      //
      3. Luego, evaluamos la función en Xi para determinar el signo de f(Xi):
      //
      f(Xi) = ${fxi}
      //4. En este caso el nuevo intervalo de [a, b] para la segunda iteración es  ${newa} y ${newb}.
      //5. Repetimos el proceso hasta que la diferencia entre a y b sea suficientemente pequeña.
    `;

    // Establecer la explicación generada
    setExplicacion(explicacionGenerada);
    setIsModalOpen(true); // Abrir el modal
  };

  // Abrir el modal
  const openModal = () => {
    //generarExplicacion();
    console.log("Ecuación:", ecuacion);
    console.log("AJAX:", ecuacionajax);
  };

  // Cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const calcular = () => {
    const { resultados, error } = metodoBiseccion(
      ecuacion,
      parseFloat(a),
      parseFloat(b)
    );
    if (error) {
      setError(error);
      setResultados([]);
      setIsEvaluado(false); // Si hay un error, no se puede habilitar el botón
    } else {
      setError(null);
      setResultados(resultados);
      setIsEvaluado(true); // La ecuación fue evaluada con éxito
    }
  };

  // Agregar expresión seleccionada en el input
  const insertarEnInput = (valor) => {
    setEcuacion((prev) => prev + valor);
  };

  const insertarEnAjax = (valor) => {
    setEcuacionajax((prev) => prev + valor);
  };

  function formatMathJaxString(input) {
    return input.replace(/\\/g, "").replace(/{/g, "(").replace(/}/g, ")");
  }

  const handleChange = (e) => {
    setEcuacionajax(e.target.value);
    const ecuacionTransformada = formatMathJaxString(e.target.value);
    setEcuacion(ecuacionTransformada);
    setMathJaxKey((prevKey) => prevKey + 1);
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        closeModal={closeModal}
        title="Explicación del Método de Bisección"
        explanation={explicacion}
      />

      <section className="biseccion-container mt-24 mb-5 transition-all duration-300 animate-fade-in-down">
        <button
          onClick={openModal}
          className="rounded-md mb-4 border-2 transform disabled:opacity-50"
          // disabled={!isEvaluado} Solo habilita el botón si se ha evaluado correctamente
        >
          Ver Explicación
        </button>

        <div className="p-6 mt-4 max-w-[90vw] mx-auto shadow-md rounded-lg border-1 method-container border-black">
          <h2 className="text-2xl font-bold my-4">Método de Bisección</h2>
          <div className="mb-4">
            <label className="block font-semibold">Ecuación:</label>
            <div className="mt-4 p-2 bg-transparent rounded-lg text-center">
              <input
                type="text"
                value={ecuacionajax}
                onChange={handleChange}
                className="border p-2 w-full rounded-lg text-center mb-4"
              />
              <MathJaxContext key={mathJaxKey}>
                <MathJax>{"\\(" + ecuacionajax + "\\)"}</MathJax>
              </MathJaxContext>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { label: "x²", value: "^2", latex: "^{2}" },
              { label: "√x", value: "sqrt(x)", latex: "\\sqrt{x}" },
              { label: "π", value: "pi", latex: " \\pi" },
              { label: "e", value: "e", latex: " e" },
              { label: "sin", value: "sin(", latex: "\\sin(" },
              { label: "cos", value: "cos(", latex: "\\cos(" },
              { label: "tan", value: "tan(", latex: "\\tan(" },
              { label: "ln", value: "ln(", latex: "\\ln(" },
              { label: "(", value: "(", latex: "(" },
              { label: ")", value: ")", latex: ")" },
              { label: "^", value: "^", latex: "^{}" },
              { label: "/", value: "/", latex: "/" },
              { label: "*", value: "*", latex: "\\cdot" }, // Para representar multiplicación en LaTeX
              { label: "+", value: "+", latex: "+" },
              { label: "-", value: "-", latex: "-" },
              { label: "C", value: "clear", latex: " " }, // No tiene representación en LaTeX
            ].map((btn) => (
              <button
                key={btn.label}
                className="bg-gray-200 border-1 opacity-80 hover:opacity-100 border-black p-2 rounded hover:bg-gray-300 shadow-md text-black font-semibold"
                onClick={() => {
                  if (btn.value === "clear") {
                    setEcuacion(""); // Botón de limpiar
                    setEcuacionajax(""); // Limpiar el input de MathJax
                  } else {
                    insertarEnInput(btn.value);
                    insertarEnAjax(btn.latex);
                  } // Agregar valor al input
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-semibold">Límite a:</label>
              <input
                type="number"
                value={a}
                onChange={(e) => setA(e.target.value)}
                className="border p-2 w-full rounded-lg text-center"
              />
            </div>
            <div>
              <label className="block font-semibold">Límite b:</label>
              <input
                type="number"
                value={b}
                onChange={(e) => setB(e.target.value)}
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
                    <th className="border p-2">a</th>
                    <th className="border p-2">b</th>
                    <th className="border p-2">Xi</th>
                    <th className="border p-2">f(a)</th>
                    <th className="border p-2">f(b)</th>
                    <th className="border p-2">f(Xi)</th>
                  </tr>
                </thead>
                <tbody>
                  {resultados.map(({ iteracion, a, b, xi, fa, fb, fxi }) => (
                    <tr key={iteracion}>
                      <td className="border p-2">{iteracion}</td>
                      <td className="border p-2">{a.toFixed(6)}</td>
                      <td className="border p-2">{b.toFixed(6)}</td>
                      <td className="border p-2">{xi.toFixed(6)}</td>
                      <td className="border p-2">{fa.toFixed(6)}</td>
                      <td className="border p-2">{fb.toFixed(6)}</td>
                      <td className="border p-2">{fxi.toFixed(6)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
