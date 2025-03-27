import { evaluate } from "mathjs";

export function evaluarFuncion(ecuacion, x) {
  try {
    return evaluate(ecuacion, { x });
  } catch (error) {
    return NaN;
  }
}

export function metodoBiseccion(ecuacion, a, b, maxIteraciones = 10) {
  let resultados = [];
  let fa = evaluarFuncion(ecuacion, a);
  let fb = evaluarFuncion(ecuacion, b);

  if (isNaN(fa) || isNaN(fb)) {
    return { error: "La ecuación no es válida o no está bien definida." };
  }

  if (fa * fb > 0) {
    return { error: "El intervalo no cumple la condición de signos opuestos." };
  }

  for (let i = 0; i < maxIteraciones; i++) {
    let xi = (a + b) / 2;
    let fxi = evaluarFuncion(ecuacion, xi);
    resultados.push({ iteracion: i + 1, a, b, xi, fa, fb, fxi });

    if (fxi === 0 || Math.abs(b - a) < 1e-6) {
      break;
    }

    if (fa * fxi < 0) {
      b = xi;
      fb = fxi;
    } else {
      a = xi;
      fa = fxi;
    }
  }

  return { resultados };
}
