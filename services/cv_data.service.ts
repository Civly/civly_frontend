import { CvData } from "@/schemas/cv_data_schema";

const path = "/cvData";

export async function fetchAll(): Promise<CvData[]> {
  const data = await fetch(path, {
    method: "GET"
  });
  return await data.json();
}

export async function fetchCv(id: string): Promise<CvData> {
  const data = await fetch(path + '/' + id, {
    method: "GET"
  });
  return await data.json();
}

export async function createEmptyCv(): Promise<{ id: string }> {
  const data = await fetch(path, {
    method: "POST",
    body: null
  });
  return await data.json() as { id: string };
}

export async function duplicateCv(id: string | null): Promise<string> {
  if (id === null) return "";
  const data = await fetch(path + '/' + id, {
    method: "POST"
  });
  const response = await data.json()
  return response.id as string;
}

export async function updateCVName(id: string, value: string) {
  await fetch(path + '/' + id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: value }),
  });
}

export async function updateVisibility(
  cv: CvData,
  value: "public" | "draft" | "private",
  newPassword: string | undefined
) {
  let payload = { visibility: value, name: cv.name } as CvData
  if(newPassword){
    payload = { visibility: value, name: cv.name, password: newPassword } as CvData
  }
  const data = await fetch(path + '/' + cv.id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return await data.json();
}

export async function updateCv(item: CvData): Promise<void> {
  await fetch(path + '/' + item.id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
}

export async function deleteCv(id: string): Promise<void> {
  await fetch(path + '/' + id, {
    method: "DELETE"
  });
}

export function handleExportPdf(cv: CvData) {
  fetch("/export/" + cv.id)
    .then(async (res) => {
      if (res.body !== null) {
        const reader = res.body.getReader();
        return new ReadableStream({
          start(controller) {
            return pump();
            function pump(): Promise<void> {
              return reader.read().then(({ done, value }) => {
                if (done) {
                  controller.close();
                  return;
                }
                controller.enqueue(value);
                return pump();
              });
            }
          },
        });
      }
    })
    .then((stream) => new Response(stream))
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(
        new Blob([blob as unknown as BlobPart], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = `cv-${cv.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
}
