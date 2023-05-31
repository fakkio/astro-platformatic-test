export function isPostRequest(request: Request) {
  return request.method === "POST";
}

export async function getFormData(request: Request) {
  const formData = await request.formData();

  return Object.fromEntries(formData.entries());
}
