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


function calcularAjuste(dias, division, importe) {
  // Limpieza y conversión del importe
  importe = parseFloat(importe.split(".").join("").replace(/,/, '.'));

  // Cálculos
  let resultadoSinIva = (importe / division) * dias; // Monto sin IVA
  let resultadoConIva = resultadoSinIva * 1.21;      // Monto con IVA

  // Actualizar el elemento 'iva' con los montos y botones
  let iva = document.getElementById("iva");
  iva.innerHTML = `
    Importe sin IVA: ${resultadoSinIva.toFixed(2)} 
    <button class="copy1" onclick="copiarAlPortapapeles('${resultadoSinIva.toFixed(2)}')"><span>
            <svg xml:space="preserve" style="enable-background:new 0 0 512 512" viewBox="0 0 6.35 6.35" y="0" x="0" height="20" width="20" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" xmlns="http://www.w3.org/2000/svg" class="clipboard">
              <g>
                <path fill="currentColor" d="M2.43.265c-.3 0-.548.236-.573.53h-.328a.74.74 0 0 0-.735.734v3.822a.74.74 0 0 0 .735.734H4.82a.74.74 0 0 0 .735-.734V1.529a.74.74 0 0 0-.735-.735h-.328a.58.58 0 0 0-.573-.53zm0 .529h1.49c.032 0 .049.017.049.049v.431c0 .032-.017.049-.049.049H2.43c-.032 0-.05-.017-.05-.049V.843c0-.032.018-.05.05-.05zm-.901.53h.328c.026.292.274.528.573.528h1.49a.58.58 0 0 0 .573-.529h.328a.2.2 0 0 1 .206.206v3.822a.2.2 0 0 1-.206.205H1.53a.2.2 0 0 1-.206-.205V1.529a.2.2 0 0 1 .206-.206z"></path>
              </g>
            </svg>
            <svg xml:space="preserve" style="enable-background:new 0 0 512 512" viewBox="0 0 24 24" y="0" x="0" height="18" width="18" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" xmlns="http://www.w3.org/2000/svg" class="checkmark">
              <g>
                <path data-original="#000000" fill="currentColor" d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"></path>
              </g>
            </svg>
          </span></button><br>
    Importe con IVA: ${resultadoConIva.toFixed(2)} 
    <button class="copy2" onclick="copiarAlPortapapeles('${resultadoConIva.toFixed(2)}')"><span>
            <svg xml:space="preserve" style="enable-background:new 0 0 512 512" viewBox="0 0 6.35 6.35" y="0" x="0" height="20" width="20" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" xmlns="http://www.w3.org/2000/svg" class="clipboard">
              <g>
                <path fill="currentColor" d="M2.43.265c-.3 0-.548.236-.573.53h-.328a.74.74 0 0 0-.735.734v3.822a.74.74 0 0 0 .735.734H4.82a.74.74 0 0 0 .735-.734V1.529a.74.74 0 0 0-.735-.735h-.328a.58.58 0 0 0-.573-.53zm0 .529h1.49c.032 0 .049.017.049.049v.431c0 .032-.017.049-.049.049H2.43c-.032 0-.05-.017-.05-.049V.843c0-.032.018-.05.05-.05zm-.901.53h.328c.026.292.274.528.573.528h1.49a.58.58 0 0 0 .573-.529h.328a.2.2 0 0 1 .206.206v3.822a.2.2 0 0 1-.206.205H1.53a.2.2 0 0 1-.206-.205V1.529a.2.2 0 0 1 .206-.206z"></path>
              </g>
            </svg>
            <svg xml:space="preserve" style="enable-background:new 0 0 512 512" viewBox="0 0 24 24" y="0" x="0" height="18" width="18" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" xmlns="http://www.w3.org/2000/svg" class="checkmark">
              <g>
                <path data-original="#000000" fill="currentColor" d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"></path>
              </g>
            </svg>
          </span></button>
  `;
  
  // Retornar el monto sin IVA si es necesario
  return resultadoSinIva.toFixed(2);
}

// Función para copiar el texto al portapapeles
function copiarAlPortapapeles(texto) {
  // Crear un elemento de texto temporal
  const inputTemporal = document.createElement("input");
  inputTemporal.value = texto;
  document.body.appendChild(inputTemporal);

  // Seleccionar el texto y copiarlo
  inputTemporal.select();
  document.execCommand("copy");

  // Eliminar el elemento temporal
  document.body.removeChild(inputTemporal);

}

function ultimaDiaDelAnio(anio, mes) {
  let fechaActual = new Date(anio, mes, 0);
  return fechaActual.getDate();
}
