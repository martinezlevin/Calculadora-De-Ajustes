let planilla = document.getElementById('planilla');
let warning = document.getElementById('warning');

formulario.addEventListener('submit', (e) => {
  e.preventDefault();
  resetearFormulario();

  let datos = new FormData(formulario);
  let importe = datos.get('importe');
  let motivo = datos.get('motivo');
  let servicio = datos.get('servicio');

  // Capturar las fechas de manera correcta
  let fechaDesde = new Date(datos.get('fechaDesde'));
  let fechaHasta = new Date(datos.get('fechaHasta'));

  let validacion = validarFormulario(importe, motivo, servicio, fechaDesde, fechaHasta);

  if (validacion) {
    // Calcular la cantidad de días entre las dos fechas, incluyendo ambos días de inicio y fin
    let diasDeAjuste = Math.floor((fechaHasta - fechaDesde) / (1000 * 60 * 60 * 24)) + 1;

    // Calcular el ajuste con el número de días correctos
    let division = ultimaDiaDelAnio(fechaHasta.getFullYear(), (fechaHasta.getMonth() + 1).toString().padStart(2, '0'));
    let ajuste = calcularAjuste(diasDeAjuste, division, importe);

    // Formatear la salida en la planilla con las fechas exactas de inicio y fin seleccionadas
    // Utilizar las fechas como fueron ingresadas en el formulario
    planilla.value = `N° de Ft:
Importe: ${importe}
Motivo: ${motivo}
Serv. afectado: ${servicio}
Cant. de días descontados: ${diasDeAjuste}
Plazo de días ajustados (desde-hasta): ${datos.get('fechaDesde')} hasta ${datos.get('fechaHasta')}
Total del ajuste: ${ajuste}`;
  }
});

copiar.addEventListener('click', () => {
  navigator.clipboard.writeText(planilla.value);
  copiar.value = 'Copiado!';
  copiar.style['background-color'] = '#800000';
});

function validarFormulario(importe, motivo, servicio,diaDesde, diaHasta){
	let patron = /,\d{1,2}/
  if (!patron.test(importe)) {
    warning.innerHTML += "⚠ Importe invalido, falta la coma decimal<br>";
  }
  if (diaDesde == '' || diaHasta == '') {
    warning.innerHTML += "⚠ Complete la fecha desde/hasta<br>";
  }
  if (!warning.innerHTML == "") {
    return false; 
  } else {
    return true;
  }
}

function resetearFormulario(){
  copiar.value = 'Copiar Planilla';
  copiar.style['background-color'] = '#154360';
  planilla.value = '';
  warning.innerHTML = "";
  iva.innerHTML = "";
}

function calcularAjuste(dias, division, importe){
  importe = importe.split(".").join("").replace(/,/, '.');
  let resultado = ((importe/division) * dias) / 1.21;
  let resultadoIva = ((importe/division) * dias);
  iva.innerHTML += "Importe con iva: " + resultadoIva.toFixed(2);
  return resultado.toFixed(2);
}

function ultimaDiaDelAnio(anio, mes) {
  let fechaActual = new Date(anio, mes, 0);
  return fechaActual.getDate();
}
