"use strict";

// ============================================
// AKENZO — ASISTENTE COMERCIAL CON IA
// Chat, memoria, análisis web y contacto WhatsApp
// Archivo: js/app.js
// ============================================

const WHATSAPP_AKENZO = "573105751619";
const CORREO_AKENZO = "somos.akenzo@gmail.com";
const INSTAGRAM_AKENZO = "https://www.instagram.com/akenzo.tech";

// ============================================
// 1. ELEMENTOS DEL HTML
// ============================================

const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const messagesContainer = document.getElementById("messages");
const clearButton = document.getElementById("clear-chat");
const linkInput = document.getElementById("link-input");
const fileInput = document.getElementById("file-input");

let isSending = false;
let ultimoAnalisis = "";
let ultimoEnlace = "";
let ultimoMensajeUsuario = "";
let ultimoBotonWhatsApp = null;

const STORAGE_SESSION_KEY = "akenzo_session_id";

function crearIdSesion() {
    return (
        "akenzo_" +
        Date.now().toString(36) +
        "_" +
        Math.random().toString(36).slice(2, 10)
    );
}

let sessionId = localStorage.getItem(STORAGE_SESSION_KEY);

if (!sessionId) {
    sessionId = crearIdSesion();
    localStorage.setItem(STORAGE_SESSION_KEY, sessionId);
}

// ============================================
// 2. UTILIDADES
// ============================================

function obtenerTexto(elemento) {
    return elemento ? elemento.value.trim() : "";
}

function normalizarURL(valor) {
    if (!valor) return "";

    let url = valor.trim();

    if (!/^https?:\/\//i.test(url)) {
        url = "https://" + url;
    }

    try {
        const parsed = new URL(url);

        if (!["http:", "https:"].includes(parsed.protocol)) {
            return "";
        }

        return parsed.href;
    } catch {
        return "";
    }
}

function extraerURL(texto) {
    if (!texto) return "";

    const coincidencia = texto.match(
        /https?:\/\/[^\s<>"']+|(?:www\.)[^\s<>"']+/i
    );

    if (!coincidencia) return "";

    const limpia = coincidencia[0].replace(/[),.;!?]+$/g, "");

    return normalizarURL(limpia);
}

function desplazarseAlFinal() {
    if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// ============================================
// 3. MOSTRAR MENSAJES DE FORMA SEGURA
// ============================================

function agregarMensaje(texto, clase = "assistant") {
    if (!messagesContainer) {
        console.error("No se encontró el elemento #messages.");
        return null;
    }

    const mensaje = document.createElement("div");
    mensaje.classList.add("message", clase);
    mensaje.textContent = String(texto ?? "");

    messagesContainer.appendChild(mensaje);
    desplazarseAlFinal();

    return mensaje;
}

function agregarMensajeHTML(texto, clase = "assistant") {
    if (!messagesContainer) return null;

    const mensaje = document.createElement("div");
    mensaje.classList.add("message", clase);

    // El texto se convierte en nodos seguros antes de mostrarlo.
    const fragmento = document.createDocumentFragment();
    const lineas = String(texto ?? "").split("\n");

    lineas.forEach((linea, indice) => {
        if (indice > 0) {
            fragmento.appendChild(document.createElement("br"));
        }

        fragmento.appendChild(document.createTextNode(linea));
    });

    mensaje.appendChild(fragmento);
    messagesContainer.appendChild(mensaje);
    desplazarseAlFinal();

    return mensaje;
}

function mostrarIndicador() {
    const indicador = agregarMensaje("Estoy revisando tu solicitud...", "assistant");
    if (indicador) indicador.classList.add("typing-indicator");
    return indicador;
}

function actualizarMensajeAsistente(elemento, texto) {
    if (!elemento) {
        agregarMensaje(texto, "assistant");
        return;
    }

    elemento.textContent = String(texto ?? "");
    elemento.classList.remove("typing-indicator");
    desplazarseAlFinal();
}

// ============================================
// 4. BOTÓN PARA SOLICITAR PROPUESTA
// ============================================

function quitarBotonWhatsAppAnterior() {
    if (ultimoBotonWhatsApp && ultimoBotonWhatsApp.parentNode) {
        ultimoBotonWhatsApp.parentNode.removeChild(ultimoBotonWhatsApp);
    }

    ultimoBotonWhatsApp = null;
}

function mostrarBotonWhatsApp() {
    if (!messagesContainer || !ultimoAnalisis) return;

    quitarBotonWhatsAppAnterior();

    const contenedor = document.createElement("div");
    contenedor.className = "message assistant akenzo-cta";

    const texto = document.createElement("p");
    texto.textContent =
        "¿Quieres recibir una propuesta basada en este análisis?";

    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "akenzo-whatsapp-button";
    boton.textContent = "Recibir propuesta por WhatsApp";

    boton.addEventListener("click", mostrarFormularioAsesoria);

    contenedor.appendChild(texto);
    contenedor.appendChild(boton);
    messagesContainer.appendChild(contenedor);

    ultimoBotonWhatsApp = contenedor;
    desplazarseAlFinal();
}

// ============================================
// 5. FORMULARIO COMERCIAL
// ============================================

function mostrarFormularioAsesoria() {
    if (!messagesContainer) return;

    const anterior = document.getElementById("akenzo-lead-form");

    if (anterior) {
        anterior.remove();
    }

    const contenedor = document.createElement("div");
    contenedor.className = "message assistant";
    contenedor.id = "akenzo-lead-form";

    const titulo = document.createElement("h3");
    titulo.textContent = "Solicita tu propuesta con AKENZO";

    const descripcion = document.createElement("p");
    descripcion.textContent =
        "Completa tus datos. Abriremos WhatsApp con tu solicitud preparada.";

    const formulario = document.createElement("form");
    formulario.className = "akenzo-formulario";

    const campos = [
        {
            id: "akenzo-nombre",
            label: "Nombre",
            placeholder: "Tu nombre",
            type: "text",
            required: true
        },
        {
            id: "akenzo-negocio",
            label: "Empresa o negocio",
            placeholder: "Nombre de tu empresa",
            type: "text",
            required: true
        },
        {
            id: "akenzo-contacto",
            label: "Correo o teléfono",
            placeholder: "Cómo podemos contactarte",
            type: "text",
            required: true
        }
    ];

    campos.forEach((campo) => {
        const grupo = document.createElement("div");
        grupo.className = "akenzo-campo";

        const label = document.createElement("label");
        label.htmlFor = campo.id;
        label.textContent = campo.label;

        const elemento = document.createElement("input");
        elemento.id = campo.id;
        elemento.name = campo.id;
        elemento.type = campo.type;
        elemento.placeholder = campo.placeholder;
        elemento.required = campo.required;
        elemento.maxLength = 150;
        elemento.autocomplete = "off";

        grupo.appendChild(label);
        grupo.appendChild(elemento);
        formulario.appendChild(grupo);
    });

    const grupoNecesidad = document.createElement("div");
    grupoNecesidad.className = "akenzo-campo";

    const labelNecesidad = document.createElement("label");
    labelNecesidad.htmlFor = "akenzo-necesidad";
    labelNecesidad.textContent = "¿Qué servicio necesitas?";

    const necesidad = document.createElement("textarea");
    necesidad.id = "akenzo-necesidad";
    necesidad.name = "necesidad";
    necesidad.placeholder =
        "Página web, automatización, marketing, inteligencia artificial...";
    necesidad.rows = 3;
    necesidad.maxLength = 1000;
    necesidad.required = true;

    grupoNecesidad.appendChild(labelNecesidad);
    grupoNecesidad.appendChild(necesidad);
    formulario.appendChild(grupoNecesidad);

    const enviar = document.createElement("button");
    enviar.type = "submit";
    enviar.className = "akenzo-whatsapp-button";
    enviar.textContent = "Continuar en WhatsApp";

    const cancelar = document.createElement("button");
    cancelar.type = "button";
    cancelar.className = "akenzo-cancel-button";
    cancelar.textContent = "Cancelar";

    cancelar.addEventListener("click", () => contenedor.remove());

    formulario.appendChild(enviar);
    formulario.appendChild(cancelar);

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const nombre = obtenerTexto(
            document.getElementById("akenzo-nombre")
        );
        const negocio = obtenerTexto(
            document.getElementById("akenzo-negocio")
        );
        const contacto = obtenerTexto(
            document.getElementById("akenzo-contacto")
        );
        const necesidadTexto = obtenerTexto(
            document.getElementById("akenzo-necesidad")
        );

        if (!nombre || !negocio || !contacto || !necesidadTexto) {
            alert("Completa todos los campos para continuar.");
            return;
        }

        const mensajeWhatsApp = [
            "Hola, equipo AKENZO. Quiero solicitar una propuesta comercial.",
            "",
            "DATOS DEL CLIENTE",
            "Nombre: " + nombre,
            "Empresa o negocio: " + negocio,
            "Contacto: " + contacto,
            "Servicio solicitado: " + necesidadTexto,
            "",
            "ANÁLISIS SOLICITADO",
            "Enlace web: " + (ultimoEnlace || "No proporcionado"),
            "",
            "MENSAJE ORIGINAL",
            ultimoMensajeUsuario || "Solicitud de asesoría comercial",
            "",
            "ANÁLISIS DE AKENZO",
            ultimoAnalisis ||
                "No hay un análisis disponible en esta conversación.",
            "",
            "Quedo atento/a a la propuesta."
        ].join("\n");

        const urlWhatsApp =
            "https://wa.me/" +
            WHATSAPP_AKENZO +
            "?text=" +
            encodeURIComponent(mensajeWhatsApp);

        const ventana = window.open(urlWhatsApp, "_blank", "noopener,noreferrer");

        if (!ventana) {
            agregarMensaje(
                "El navegador bloqueó la ventana. Abre este enlace para continuar: " +
                    urlWhatsApp,
                "assistant"
            );
        } else {
            agregarMensaje(
                "WhatsApp se ha abierto con tu solicitud preparada. Recuerda pulsar Enviar allí para hacérnosla llegar.",
                "assistant"
            );
        }
    });

    contenedor.appendChild(titulo);
    contenedor.appendChild(descripcion);
    contenedor.appendChild(formulario);

    messagesContainer.appendChild(contenedor);
    desplazarseAlFinal();
}

// ============================================
// 6. ENVIAR MENSAJE A LA IA
// ============================================

async function enviarMensaje(evento) {
    if (evento) evento.preventDefault();

    if (isSending || !input || !messagesContainer) return;

    const mensajeUsuario = input.value.trim();
    const enlaceManual = obtenerTexto(linkInput);
    const enlaceDetectado = normalizarURL(enlaceManual) ||
        extraerURL(mensajeUsuario);

    if (!mensajeUsuario && !enlaceDetectado) {
        input.focus();
        return;
    }

    isSending = true;

    const textoParaMostrar = mensajeUsuario ||
        "Analiza este sitio web: " + enlaceDetectado;

    agregarMensaje(textoParaMostrar, "user");

    ultimoMensajeUsuario = textoParaMostrar;
    ultimoEnlace = enlaceDetectado;

    input.value = "";

    const enlaceAnterior = enlaceManual;
    if (linkInput) linkInput.value = "";

    const indicador = mostrarIndicador();

    const botonEnviar = form
        ? form.querySelector('button[type="submit"]')
        : null;

    if (botonEnviar) botonEnviar.disabled = true;

    try {
        const respuesta = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: textoParaMostrar,
                url: enlaceDetectado,
                sessionId: sessionId
            })
        });

        let datos;

        try {
            datos = await respuesta.json();
        } catch {
            throw new Error("El servidor devolvió una respuesta no válida.");
        }

        if (!respuesta.ok) {
            throw new Error(
                datos.error ||
                datos.message ||
                "No fue posible procesar tu mensaje."
            );
        }

        const respuestaIA =
            datos.reply ||
            datos.response ||
            datos.message ||
            "No recibí una respuesta. Inténtalo nuevamente.";

        actualizarMensajeAsistente(indicador, respuestaIA);

        // Guardar el último resultado para el formulario comercial.
        ultimoAnalisis = respuestaIA;

        if (datos.enlaceDetectado) {
            ultimoEnlace = datos.enlaceDetectado;
        }

        // Mostrar el botón comercial solo cuando se compartió un enlace.
        if (ultimoEnlace) {
            mostrarBotonWhatsApp();
        }
    } catch (error) {
        console.error("Error en el chat de AKENZO:", error);

        actualizarMensajeAsistente(
            indicador,
            "No pude procesar tu solicitud en este momento. " +
            (error.message || "Verifica que el servidor esté funcionando.") +
            " Inténtalo nuevamente."
        );

        // Recuperar el enlace escrito si la solicitud falló.
        if (linkInput && enlaceAnterior) {
            linkInput.value = enlaceAnterior;
        }
    } finally {
        isSending = false;

        if (botonEnviar) botonEnviar.disabled = false;

        if (input) input.focus();

        desplazarseAlFinal();
    }
}

// ============================================
// 7. BORRAR CONVERSACIÓN
// ============================================

async function borrarConversacion() {
    const confirmar = window.confirm(
        "¿Quieres borrar la conversación y reiniciar la memoria de este chat?"
    );

    if (!confirmar) return;

    if (clearButton) clearButton.disabled = true;

    try {
        const respuesta = await fetch("/api/chat", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                sessionId: sessionId
            })
        });

        if (!respuesta.ok) {
            let detalle = "";

            try {
                const datos = await respuesta.json();
                detalle = datos.error || "";
            } catch {
                // La respuesta no contenía JSON.
            }

            throw new Error(
                detalle || "No se pudo borrar la conversación del servidor."
            );
        }

        if (messagesContainer) {
            messagesContainer.replaceChildren();
        }

        ultimoAnalisis = "";
        ultimoEnlace = "";
        ultimoMensajeUsuario = "";
        ultimoBotonWhatsApp = null;

        agregarMensaje(
            "Hola, soy el asistente de AKENZO. ¿Cómo puedo ayudarte con tu negocio?",
            "assistant"
        );
    } catch (error) {
        console.error("Error al borrar la conversación:", error);

        agregarMensaje(
            "No pude confirmar el borrado en el servidor. " +
            (error.message || "Inténtalo nuevamente."),
            "assistant"
        );
    } finally {
        if (clearButton) clearButton.disabled = false;
    }
}

// ============================================
// 8. ADJUNTAR ARCHIVOS
// ============================================

if (fileInput) {
    fileInput.addEventListener("change", () => {
        if (!fileInput.files || fileInput.files.length === 0) return;

        const archivos = Array.from(fileInput.files);
        const resumen = archivos.map((archivo) =>
            archivo.name + " (" + Math.ceil(archivo.size / 1024) + " KB)"
        );

        agregarMensaje(
            "Seleccionaste estos archivos:\n" + resumen.join("\n") +
            "\n\nEsta versión informa qué archivos seleccionaste, pero no los envía al servidor. Para analizarlos hay que implementar la carga de archivos en el backend.",
            "assistant"
        );
    });
}

// ============================================
// 9. ESTADO DEL SERVIDOR (OPCIONAL)
// ============================================

async function comprobarServidor() {
    try {
        const respuesta = await fetch("/api/status");

        if (!respuesta.ok) {
            console.warn("El servidor respondió con estado:", respuesta.status);
            return;
        }

        const datos = await respuesta.json();
        console.info("Estado de AKENZO:", datos);
    } catch (error) {
        console.warn("No fue posible consultar /api/status:", error);
    }
}

// ============================================
// 10. INICIALIZACIÓN
// ============================================

if (form) {
    form.addEventListener("submit", enviarMensaje);
} else {
    console.error("No se encontró el formulario #chat-form.");
}

if (clearButton) {
    clearButton.addEventListener("click", borrarConversacion);
}

if (input) {
    input.addEventListener("keydown", (evento) => {
        if (
            evento.key === "Enter" &&
            !evento.shiftKey &&
            !evento.isComposing
        ) {
            evento.preventDefault();

            if (form && typeof form.requestSubmit === "function") {
                form.requestSubmit();
            } else {
                enviarMensaje();
            }
        }
    });
}

if (messagesContainer && messagesContainer.children.length === 0) {
    agregarMensaje(
        "Hola, soy el asistente de AKENZO. Puedo ayudarte con estrategia digital, páginas web, automatización e inteligencia artificial. Si compartes un enlace, intentaré analizarlo con las capacidades habilitadas en el servidor.",
        "assistant"
    );
}

comprobarServidor();

// ============================================
// FIN DE js/app.js
// ============================================
