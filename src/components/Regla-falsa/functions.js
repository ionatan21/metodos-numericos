import { evaluate, log } from "mathjs";

export const evaluarFuncion = (ecuacion, x) => {
  try {
    const evaluacion = evaluate(ecuacion, { x });
    return evaluacion;
  } catch (error) {
    return null;
  }
};

export const metodoSecante = (ecuacion, x0, x1) => {
  let iteracion = 0;
  let resultados = [];

  while (iteracion < 10) {
    const fx0 = evaluarFuncion(ecuacion, x0);
    const fx1 = evaluarFuncion(ecuacion, x1);

    if (fx0 === null || fx1 === null) {
      return { error: "Error al evaluar la función en los puntos dados." };
    }

    const xn = x1 - (fx1 * (x1 - x0)) / (fx1 - fx0);
    const fxn = evaluarFuncion(ecuacion, xn);

    if (fxn === null) {
      return { error: "Error al evaluar la función en el punto Xn." };
    }

    resultados.push({
      iteracion: iteracion + 1,
      x0,
      fx0,
      x1,
      fx1,
      xn,
      fxn,
    });

    if (fxn * fx0 < 0) { // si fxn y fxo son de signos opuestos
      if (xn < x0) { //si xn es menor que x0
        x0 = xn; // nuevo x0 = xn
        x1 = x0; // nuevo x1 = x0
      } else {
        x1 = xn; // nuevo x1 = xn y x0 se mantiene
      }
    } else { // si fxn y fx1 son de signos opuestos
      if (xn < x1) { //si xn es menor que x1
        x0 = xn; // nuevo x0 = xn y x1 se mantiene
      } else {
        x0 = x1; // nuevo x0 = x1
        x1 = xn; // nuevo x1 = xn
      }
    }

    iteracion++;
  }

  return { resultados, error: null };
};
