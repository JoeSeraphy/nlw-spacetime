"use client";
import { FormEvent } from "react";
import { MediaPicker } from "./MeidaPicker";
import { Camera } from "lucide-react";
import Cookie from "js-cookie";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function NewMemoriesForm() {
  const router = useRouter();

  async function handleCreateMemory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const fileToUplaod = formData.get("coverUrl");

    let coverUrl;

    if (fileToUplaod) {
      const uploadFormData = new FormData();
      uploadFormData.set("file", fileToUplaod);

      const uploadResponse = await api.post("/upload", uploadFormData);
      coverUrl = uploadResponse.data.fileUrl;
    }

    const token = Cookie.get("token");

    await api.post(
      "/memories",
      {
        coverUrl,
        content: formData.get("content"),
        isPublic: formData.get("isPublic"),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    router.push("/");
  }

  return (
    <>
      <form
        onSubmit={handleCreateMemory}
        className="flex flex-1 flex-col gap-2"
      >
        <div className="flex items-center gap-4">
          <label
            htmlFor="media"
            className="flex cursor-pointer gap-1.5 text-sm text-gray-200 hover:text-gray-100"
          >
            <Camera className="h-4 w-4" />
            Anexar mídia
          </label>
          <label
            htmlFor="isPublic"
            className="flex cursor-pointer gap-1.5 text-sm text-gray-200 hover:text-gray-100"
          >
            <input
              type="checkbox"
              name="isPublic"
              id="isPublic"
              className="h-4 w-4 rounded border-gray-400 bg-gray-700 text-purple-500"
            />
            tornar memoria publica
          </label>
        </div>
        <MediaPicker />

        <textarea
          name="content"
          spellCheck={false}
          placeholder="Fique livre para adicionar fotos, vídeos e ralatos sobre essa experiência que quer lembrar para sempre"
          className=" w-full flex-1 resize-none rounded border-0 bg-transparent p-0 text-lg leading-relaxed text-gray-100 placeholder:text-gray-400 focus:ring-0"
        />
      </form>
    </>
  );
}