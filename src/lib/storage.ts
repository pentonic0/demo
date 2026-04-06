import axios from "axios";

export interface UploadProgress {
  progress: number;
  state: 'paused' | 'running' | 'success' | 'error';
}

export const uploadFile = async (
  file: File, 
  path: string, 
  onProgress?: (progress: UploadProgress) => void
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", path);

    if (onProgress) {
      onProgress({ progress: 0, state: 'running' });
    }

    const response = await axios.post("/api/upload", formData, {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          onProgress({ progress, state: 'running' });
        }
      }
    });

    if (onProgress) {
      onProgress({ progress: 100, state: 'success' });
    }

    return response.data.url;
  } catch (error: any) {
    console.error("Upload Error:", error);
    if (onProgress) {
      onProgress({ progress: 0, state: 'error' });
    }
    const message = error.response?.data?.error || error.message || "Failed to upload file";
    throw new Error(message);
  }
};
