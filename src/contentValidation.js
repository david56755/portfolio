// Rechazar estructuras inesperadas antes de usarlas en texto o enlaces.
const text = (value, max = 2000) =>
  typeof value === "string" &&
  value.length > 0 &&
  value.length <= max &&
  !/[\u0000-\u001f\u007f]/u.test(value);
const list = (value) =>
  Array.isArray(value) &&
  value.length <= 20 &&
  value.every((item) => text(item, 200));
export function validateContent(data) {
  return Boolean(
    data &&
    text(data.name, 100) &&
    text(data.location, 200) &&
    text(data.email, 254) &&
    /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email) &&
    typeof data.whatsapp === "string" &&
    /^[1-9][0-9]{6,14}$/.test(data.whatsapp) &&
    data.project &&
    text(data.project.name, 150) &&
    text(data.project.description) &&
    text(data.project.status, 200) &&
    text(data.project.note) &&
    list(data.project.stack) &&
    list(data.project.features),
  );
}
