import { useEffect, useState } from "react";
import { metodoSecante, evaluarFuncion } from "./functions";
import Modal from "../Utils/Modal";
import "./Secante.css";
import { MathJax, MathJaxContext } from "better-react-mathjax";

export default function Secante() {
  const [ecuacion, setEcuacion] = useState("sqrt(x)-cos(x)");
  const [ecuacionajax, setEcuacionajax] = useState(" \\sqrt{x} -  \\cos(x)");

  const [x0, setX0] = useState(0);
  const [x1, setX1] = useState(1);
  const [resultados, setResultados] = useState([]);
  const [resultadosSn, setResultadosSn] = useState([]);
  const [mostrarNotacionCientifica, setMostrarNotacionCientifica] =
    useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [explicacion, setExplicacion] = useState("");
  const [isEvaluado, setIsEvaluado] = useState(false);

  const [mathJaxKey, setMathJaxKey] = useState(0);

  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typeset();
    }
  }, [ecuacionajax]);

  const generarExplicacion = () => {
    const fx0 = evaluarFuncion(ecuacion, x0);
    const fx1 = evaluarFuncion(ecuacion, x1);

    const explicacionGenerada = `
      El Método de Secante se utiliza para encontrar la raíz de una función continua. 
      // 1. En este caso, tenemos la función f(x) = ${ecuacion}.
      // 2. Dados los puntos iniciales X0 = ${x0} y X1 = ${x1}, se calculan los valores de la función en esos puntos: f(X0) = ${fx0.toFixed(
      2
    )} y f(X1) = ${fx1.toFixed(2)}.
      // 3. Se calcula el siguiente valor Xn utilizando la fórmula:
      //Xn = X1 - (f(X1) * (X1 - X0)) / (f(X1) - f(X0))
      // 4. Sustituyendo los valores obtenidos, tenemos: Xn = ${x1} - (${fx1.toFixed(
      6
    )} * (${x1} - ${x0})) / (${fx1.toFixed(2)} - ${fx0.toFixed(
      2
    )}) = ${resultados[0]?.xn.toFixed(6)}
      // 5. Ahora se evalúa la función en el nuevo punto Xn: f(Xn) = ${resultados[0]?.fxn.toFixed(
        6
      )}
      // 6. En cada iteración, se repiten los pasos anteriores, actualizando los valores de X0 y X1 con el valor de Xn y Xn-1.
      // en este caso el nuevo valor para segunda iteración de X0 es ${resultados[0]?.xn.toFixed(
        6
      )} y el nuevo valor de X1 es ${x1}.
      //Este proceso se repite iterativamente hasta obtener una aproximación suficiente.
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

  function toScientificNotation(num, precision = 1) {
    if (num === 0) return "0"; // Manejar el caso especial de 0
    let exponent = Math.floor(Math.log10(Math.abs(num)));
    let coefficient = (num / Math.pow(10, exponent)).toFixed(precision);
    return `${coefficient}*10^${exponent}`;
  }

  function convertArrayToScientific(arr) {
    return arr.map((entry) => {
      let newEntry = { ...entry };
      for (let key in entry) {
        if (key !== "iteracion" && typeof entry[key] === "number") {
          newEntry[key] = toScientificNotation(entry[key]);
        }
      }
      return newEntry;
    });
  }

  function redondearDatos(array) {
    return array.map((obj) => ({
      iteracion: obj.iteracion, // Mantener la iteración sin cambios
      ...Object.fromEntries(
        Object.entries(obj)
          .filter(([key]) => key !== "iteracion") // Excluir "iteracion" del procesamiento
          .map(([key, value]) => [
            key,
            typeof value === "number" ? parseFloat(value.toFixed(6)) : value,
          ])
      ),
    }));
  }

  function formatMathJaxString(input) {
    return input.replace(/\\/g, "").replace(/{/g, "(").replace(/}/g, ")");
  }

  const handleChange = (e) => {
    setEcuacionajax(e.target.value);
    const ecuacionTransformada = formatMathJaxString(e.target.value);
    setEcuacion(ecuacionTransformada);
    setMathJaxKey((prevKey) => prevKey + 1);
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

      setResultados(redondearDatos(resultados)); // Redondear a 6 decimales
      setResultadosSn(convertArrayToScientific(resultados)); // Convertir a notación científica
      setIsEvaluado(true);
    }
    const result = document.getElementById("resultado");
    setTimeout(() => {
      if (result) {
        result.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // Agregar expresión seleccionada en el input
  const insertarEnInput = (valor) => {
    setEcuacion((prev) => prev + valor);
  };

  const insertarEnAjax = (valor) => {
    setEcuacionajax((prev) => prev + valor);
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        closeModal={closeModal}
        title="Explicación del Método de Secante"
        explanation={explicacion}
      />

      <section className="secante-container mt-24 mb-5 transition-all duration-300 animate-fade-in-down">
        <button
          onClick={openModal}
          className="rounded-md mb-4 border-2 transform disabled:opacity-50"
          disabled={!isEvaluado}
        >
          Ver Explicación
        </button>

        <div className="p-6 mt-4 max-w-[90vw] mx-auto shadow-md rounded-lg border-1 method-container border-black">
          <h2 className="text-2xl font-bold my-4">Método de Secante</h2>
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
              { label: "√x", value: "sqrt(x)", latex: " \\sqrt{x}" },
              { label: "π", value: "pi", latex: " \\pi" },
              { label: "e", value: "e", latex: " e" },
              { label: "sin", value: "sin(", latex: " \\sin(" },
              { label: "cos", value: "cos(", latex: " \\cos(" },
              { label: "tan", value: "tan(", latex: " \\tan(" },
              { label: "ln", value: "ln(", latex: " \\ln(" },
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
                    setEcuacionajax(" "); // Limpiar el input de MathJax
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
              <label className="block font-semibold">Valor X0:</label>
              <input
                type="number"
                value={x0}
                onChange={(e) => setX0(e.target.value)}
                className="border p-2 w-full rounded-lg text-center shadow-md"
              />
            </div>
            <div>
              <label className="block font-semibold">Valor X1:</label>
              <input
                type="number"
                value={x1}
                onChange={(e) => setX1(e.target.value)}
                className="border p-2 w-full rounded-lg text-center shadow-md"
              />
            </div>
          </div>
          <div className="w-full  flex justify-center items-center mt-4">
            <button
              onClick={calcular}
              className="bg-gray-400 h-11 w-full border-1  border-black border-e-black shadow-md text-black px-4 py-[10px] rounded"
            >
              Calcular
            </button>

            <select
              className="ml-4 border-1 h-11 w-full border-black rounded-lg px-4 py-[10px] shadow-md"
              onChange={(e) =>
                setMostrarNotacionCientifica(e.target.value === "sn")
              }
            >
              <option value="sn">Not Científica</option>
              <option value="decimal">Not Decimal</option>
            </select>
          </div>

          <section id="resultado">
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {resultados.length > 0 && (
              <div className="mt-4 overflow-x-auto animate-fade-in-down">
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
                    {(mostrarNotacionCientifica
                      ? resultadosSn
                      : resultados
                    ).map((row, index) => (
                      <tr key={index}>
                        <td className="border p-2">{row.iteracion}</td>
                        <td className="border p-2">{row.x0}</td>
                        <td className="border p-2">{row.fx0}</td>
                        <td className="border p-2">{row.x1}</td>
                        <td className="border p-2">{row.fx1}</td>
                        <td className="border p-2">{row.xn}</td>
                        <td className="border p-2">{row.fxn}</td>
                        <td className="border p-2">
                          {row.errorAbs ? row.errorAbs : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </section>
    </>
  );
}
