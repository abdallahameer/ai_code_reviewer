import axios from "axios";
import { useRef, useState } from "react";

interface File {
  path: string;
  content: string;
}

const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // مهم عشان الكوكي
});

const fetcher = async (url: string) => {
  try {
    const res = await api.get(url);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

function usePost<T = any>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const postData = async (url: string, body: any) => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.post(url, body);
      setData(res.data);

      return res.data; // مهم عشان تقدر تستخدمه مباشرة لو حبيت
    } catch (err: any) {
      setError(err.response?.data || err.message);
      throw err; // نخليه يرمي الخطأ لو حبيت تمسكه بره
    } finally {
      setLoading(false);
    }
  };

  return {
    postData,
    data,
    loading,
    error,
  };
}

const useStreamReview = () => {
  const [review, setReview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // keeps a reference to the current request so we can cancel it
  const abortControllerRef = useRef<AbortController | null>(null);

  async function startReview(files: File[]) {
    // if a previous request is still running, cancel it first
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // create a fresh abort controller for this new request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setReview("");
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/ai-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files }),
        signal: controller.signal, // attach the abort signal
      });

      if (!res.ok) {
        const err = await res.text();
        setError(err || "Request failed");
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const token = decoder.decode(value);
        setReview((prev) => prev + token);
      }
    } catch (err: any) {
      // if the error is just us cancelling the request, ignore it silently
      if (err?.name === "AbortError") return;
      setError(err?.message || "Unknown error");
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }

  // lets the user manually cancel from the UI
  function cancelReview() {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }

  return { startReview, cancelReview, review, loading, error };
};

export { fetcher, usePost, useStreamReview };
