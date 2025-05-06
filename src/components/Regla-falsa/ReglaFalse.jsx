import { useEffect, useState } from "react";
import { metodoSecante, evaluarFuncion } from "./functions";
import Modal from "../Utils/Modal";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import {
  convertArrayToScientific,
  convertirMinusculas,
  formatMathJaxString,
  redondearDatos,
} from "../Utils/general-functions";
import MathButtonGrid from "../Utils/MathButtonGrid";

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
    const xn = resultados[0]?.xn.toFixed(6);
    const fxn = resultados[0]?.fxn.toFixed(6);
    let newa = 0;
    let newb = 0;

    if (fxn * fx0 < 0) {
      if (fxn > fx0) {
        newa = x0;
        newb = xn;
      } else {
        newa = xn;
        newb = x0;
      }
    } else {
      if (fxn > fx1) {
        newa = x1;
        newb = xn;
      } else {
        newa = xn;
        newb = x1;
      }
    }

    const explicacionGenerada = `
      El Método de Regla Falsa se utiliza para encontrar la raíz de una función continua. 
      // 1. En este caso, tenemos la función f(x) = ${ecuacion}.
      // 2. Dados los puntos iniciales X0 = ${x0} y X1 = ${x1}, se calculan los valores de la función en esos puntos: f(X0) = ${fx0.toFixed(
      2
    )} y f(X1) = ${fx1.toFixed(2)}.
      // 3. Se calcula el siguiente valor Xn utilizando la fórmula:
      //Xn = X1 - (f(X1) * (X1 - X0)) / (f(X1) - f(X0))
      // 4. Sustituyendo los valores obtenidos, tenemos: Xn = ${x1} - (${fx1.toFixed(
      6
    )} * (${x1} - ${x0})) / (${fx1.toFixed(2)} - ${fx0.toFixed(2)}) = ${xn}
      // 5. Ahora se evalúa la función en el nuevo punto Xn: f(Xn) = ${resultados[0]?.fxn.toFixed(
        6
      )}
      // 6. En cada iteración, se evalúan f(Xn) con f(X0) y f(X1) buscando cuál de estos tiene signo contrario con f(Xn)
      //
      // en este caso el nuevo valor para segunda iteración de X0 es ${newa} y el nuevo valor de X1 es ${newb}.
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

  const handleChange = (e) => {
    const valor = convertirMinusculas(e.target.value);
    setEcuacionajax(valor);
    const ecuacionTransformada = formatMathJaxString(valor);
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

  const insertarEnAjax = (valor, cursorOffset = 0) => {
    const input = document.getElementById("miInput");
    if (!input) return;

    const start = input.selectionStart;
    const end = input.selectionEnd;

    const newValue =
      ecuacionajax.slice(0, start) + valor + ecuacionajax.slice(end);
    setEcuacionajax(newValue);

    // Esperamos un tick para colocar el cursor en la nueva posición
    setTimeout(() => {
      const pos = start + valor.length + cursorOffset;
      input.setSelectionRange(pos, pos);
      input.focus();
    }, 0);
  };

  function enfocarInput() {
    document.getElementById("miInput").focus();
  }

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        closeModal={closeModal}
        title="Explicación del Método de Regla Falsa"
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
          <h2 className="text-2xl font-bold my-4">Método de Regla Falsa</h2>
          <div className="mb-4">
            <label className="block font-semibold">Ecuación:</label>
            <div className="mt-4 p-2 bg-transparent rounded-lg text-center">
              <input
                type="text"
                value={ecuacionajax}
                onChange={handleChange}
                className="border p-2 w-full rounded-lg text-center mb-4"
                id="miInput"
              />
              <MathJaxContext key={mathJaxKey}>
                <MathJax>{"\\(" + ecuacionajax + "\\)"}</MathJax>
              </MathJaxContext>
            </div>
          </div>
          <MathButtonGrid
            insertarEnInput={insertarEnInput}
            insertarEnAjax={insertarEnAjax}
            setEcuacion={setEcuacion}
            setEcuacionajax={setEcuacionajax}
            enfocarInput={enfocarInput}
          />
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
