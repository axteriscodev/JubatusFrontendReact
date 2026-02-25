type FormDataPrimitive = string | number | boolean | File | Blob | null | undefined;
type FormDataObject = { [key: string]: FormDataPrimitive | FormDataObject | FormDataObject[] };

export function jsonToFormData(
  obj: FormDataPrimitive | FormDataObject | FormDataObject[],
  form: FormData = new FormData(),
  parentKey = "",
): FormData {
  if (obj === null || obj === undefined) return form;

  if (typeof obj !== "object" || obj instanceof File || obj instanceof Blob) {
    form.append(parentKey, (obj as string | File | Blob) ?? "");
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
      jsonToFormData(value as FormDataObject, form, formKey);
    } else {
      form.append(formKey, (value as string) ?? "");
    }
  });

  return form;
}

export function objectToFormData(
  obj: FormDataObject,
  form: FormData = new FormData(),
  namespace = "",
): FormData {
  for (const key in obj) {
    if (obj[key] === undefined || obj[key] === null) continue;

    const formKey = namespace ? `${namespace}[${key}]` : key;
    const value = obj[key];

    if (typeof value === "object" && !(value instanceof File)) {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          objectToFormData(item as FormDataObject, form, `${formKey}[${index}]`);
        });
      } else {
        objectToFormData(value as FormDataObject, form, formKey);
      }
    } else {
      form.append(formKey, value as string | File);
    }
  }
  return form;
}
