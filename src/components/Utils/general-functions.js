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

function convertirMinusculas(texto) {
  return texto.toLowerCase();
}

export {
  toScientificNotation,
  convertArrayToScientific,
  redondearDatos,
  formatMathJaxString,
  convertirMinusculas,
};
