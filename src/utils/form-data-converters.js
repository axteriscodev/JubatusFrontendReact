export function jsonToFormData(obj, form = new FormData(), parentKey = "") {
  if (obj === null || obj === undefined) return form;

  if (typeof obj !== "object" || obj instanceof File || obj instanceof Blob) {
    form.append(parentKey, obj ?? "");
    return form;
  }

  Object.entries(obj).forEach(([key, value]) => {
    const formKey = parentKey
      ? Array.isArray(obj)
        ? `${parentKey}[${key}]`
        : `${parentKey}.${key}`
      : key;

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        jsonToFormData(item, form, `${formKey}[${index}]`);
      });
    } else if (typeof value === "object" && value !== null) {
      jsonToFormData(value, form, formKey);
    } else {
      // Gestione valori null o undefined
      form.append(formKey, value ?? "");
    }
  });

  return form;
}

export function objectToFormData(obj, form = new FormData(), namespace = "") {
  for (let key in obj) {
    if (obj[key] === undefined || obj[key] === null) continue;

    const formKey = namespace ? `${namespace}[${key}]` : key;

    if (typeof obj[key] === "object" && !(obj[key] instanceof File)) {
      if (Array.isArray(obj[key])) {
        obj[key].forEach((item, index) => {
          objectToFormData(item, form, `${formKey}[${index}]`);
        });
      } else {
        objectToFormData(obj[key], form, formKey);
      }
    } else {
      form.append(formKey, obj[key]);
    }
  }
  return form;
}
