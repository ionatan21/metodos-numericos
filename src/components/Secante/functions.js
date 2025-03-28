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
  let errorAbs = null;
  let previoXn = 0;

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

    if (iteracion > 0) {
      errorAbs = Math.abs(xn - previoXn);
      if (errorAbs < 1e-6) break;
    }

    resultados.push({
      iteracion: iteracion + 1,
      x0,
      fx0,
      x1,
      fx1,
      xn,
      fxn,
      errorAbs,
    });

    // Actualizamos los valores para la siguiente iteración
    if (iteracion > 0) {
      console.log(
        `Iteración ${iteracion + 1}: x0 = ${x0}, x1 = ${x1}, xn = ${xn}`
      );

      if (xn < previoXn) {
        x1 = previoXn;
        x0 = xn;
      } else {
        x1 = xn;
        x0 = previoXn;
      }
    } else {
      console.log(
        `Else / Iteración ${iteracion + 1}: x0 = ${x0}, x1 = ${x1}, xn = ${xn}`
      );

      if (xn < x1) {
        console.log(xn + " < " + x1);

        x1 = x1;
        x0 = xn;
      } else {
        console.log(xn + " > " + x1);
        x0 = x1; // 2
        x1 = xn; // 3
      }
    }

    previoXn = xn;
    iteracion++;
  }

  return { resultados, error: null };
};
