// Año en footer
document.getElementById("year").textContent = new Date().getFullYear();

// Menú móvil
const burger = document.getElementById("burger");
const mobileMenu = document.getElementById("mobileMenu");

function openMenu() {
  document.body.classList.add("body--lock");
  burger.setAttribute("aria-expanded", "true");
  mobileMenu.hidden = false;
  // Forzar reflow para transición
  // eslint-disable-next-line no-unused-expressions
  mobileMenu.offsetHeight;
  mobileMenu.classList.add("is-open");
}

function closeMenu() {
  mobileMenu.classList.remove("is-open");
  burger.setAttribute("aria-expanded", "false");
  // Espera la transición antes de ocultar para accesibilidad
  const onEnd = () => {
    mobileMenu.hidden = true;
    mobileMenu.removeEventListener("transitionend", onEnd);
  };
  mobileMenu.addEventListener("transitionend", onEnd);
  document.body.classList.remove("body--lock");
}

burger?.addEventListener("click", () => {
  const expanded = burger.getAttribute("aria-expanded") === "true";
  if (expanded) closeMenu(); else openMenu();
});

// Cerrar con ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && burger.getAttribute("aria-expanded") === "true") {
    closeMenu();
    burger.focus();
  }
});

// Cerrar al hacer clic fuera
document.addEventListener("click", (e) => {
  if (
    burger.getAttribute("aria-expanded") === "true" &&
    !mobileMenu.contains(e.target) &&
    !burger.contains(e.target)
  ) {
    closeMenu();
  }
});

// Cerrar al navegar (data-menu-close en enlaces)
mobileMenu.querySelectorAll("[data-menu-close]").forEach((a) =>
  a.addEventListener("click", () => closeMenu())
);

// WhatsApp dinámico
const wa = document.getElementById("whatsappLink");
wa.href = createWhatsAppURL({
  phone: "+521XXXXXXXXXX", // <- tu número (MX con 52)
  text: "Hola, me interesa una cotización para reparación/diseño de moldes."
});

// Validación y mailto
const form = document.getElementById("contactForm");
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  const errors = validate(data);
  // Reset errores
  form.querySelectorAll(".error").forEach((el) => (el.style.display = "none"));
  if (errors.length) {
    errors.forEach(({ field, message }) => {
      const small = form
        .querySelector(`[name="${field}"]`)
        ?.closest(".field")
        ?.querySelector(".error");
      if (small) { small.textContent = message; small.style.display = "block"; }
    });
    return;
  }
  const subject = encodeURIComponent("Solicitud de cotización · REDIMO");
  const body = encodeURIComponent(
`Nombre: ${data.name}
Correo: ${data.email}
Empresa: ${data.company || "-"}
Teléfono: ${data.phone || "-"}

Proyecto:
${data.message}

Gracias.`
  );
  window.location.href = `mailto:contacto@redimo.mx?subject=${subject}&body=${body}`;
});

// Utilidades
function validate(d) {
  const errs = [];
  if (!d.name?.trim()) errs.push({ field: "name", message: "Este campo es obligatorio." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email || "")) errs.push({ field: "email", message: "Ingresa un correo válido." });
  if (!d.message?.trim()) errs.push({ field: "message", message: "Describe brevemente el proyecto." });
  return errs;
}
function createWhatsAppURL({ phone, text }) {
  const base = "https://wa.me/";
  return `${base}${phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(text)}`;
}
