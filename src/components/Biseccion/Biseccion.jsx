import { useState } from "react";
import { metodoBiseccion, evaluarFuncion } from "./functions";
import Modal from "../Utils/Modal";
import "./Biseccion.css";

export default function Biseccion() {
  const [ecuacion, setEcuacion] = useState("sqrt(x)-cos(x)");
  const [a, setA] = useState(0);
  const [b, setB] = useState(1);
  const [resultados, setResultados] = useState([]);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [explicacion, setExplicacion] = useState("");
  const [isEvaluado, setIsEvaluado] = useState(false); // Estado para controlar la evaluación

  const generarExplicacion = () => {
    // Evaluamos la función en los puntos a y b
    const fa = evaluarFuncion(ecuacion, a);
    const fb = evaluarFuncion(ecuacion, b);

    // Generar la explicación teórica con los valores actuales
    const explicacionGenerada = `
      El Método de Bisección se utiliza para encontrar la raíz de una función continua. En este caso, tenemos la función f(x) = ${ecuacion}.
      //
      Dado el intervalo [a, b] = [${a}, ${b}], tenemos los siguientes valores:
      //
      f(a) = ${fa.toFixed(6)}
      //
      f(b) = ${fb.toFixed(6)}
      //
      Sabemos que el método de bisección requiere que f(a) y f(b) tengan signos opuestos, lo cual es necesario para garantizar que exista una raíz en el intervalo.
      //
      En cada iteración, calculamos el punto Xi como la mitad del intervalo:
      //
      Xi = (a + b) / 2 = ${(a + b) / 2}
      //
      Luego, evaluamos la función en Xi, y dependiendo de si f(Xi) tiene el mismo signo que f(a) o f(b), reducimos el intervalo y repetimos el proceso.
    `;

    // Establecer la explicación generada
    setExplicacion(explicacionGenerada);
    setIsModalOpen(true); // Abrir el modal
  };

  // Abrir el modal
  const openModal = () => {
    generarExplicacion();
  };

  // Cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const convertirEcuacion = (input) => {
    return input
      .replace(/\\sqrt\{([^}]+)\}/g, "sqrt($1)") // Convierte \sqrt{x} a sqrt(x)
      .replace(/\\cos\(([^)]+)\)/g, "cos($1)") // Convierte \cos(x) a cos(x)
      .replace(/\\sin\(([^)]+)\)/g, "sin($1)") // Convierte \sin(x) a sin(x)
      .replace(/\\tan\(([^)]+)\)/g, "tan($1)") // Convierte \tan(x) a tan(x)
      .replace(/\\pi/g, "pi") // Convierte \pi a pi (math.js ya lo reconoce)
      .replace(/\be\b/g, "e"); // Asegura que 'e' sola represente el número de Euler
  };

  const handleChange = (e) => {
    const ecuacionTransformada = convertirEcuacion(e.target.value);
    setEcuacion(ecuacionTransformada);
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
          disabled={!isEvaluado} // Solo habilita el botón si se ha evaluado correctamente
        >
          Ver Explicación
        </button>

        <div className="p-6 mt-4 max-w-[90vw] mx-auto shadow-md rounded-lg border-1 method-container border-black">
          <h2 className="text-2xl font-bold my-4">Método de Bisección</h2>
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
                  if (btn.value === "clear")
                    setEcuacion(""); // Botón de limpiar
                  else insertarEnInput(btn.value);
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
