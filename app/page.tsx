"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function Home() {
  const handleClick = () => {
    axios.get("/api/auth/signin/twitter").then((response) => {
      window.location.href = response.data.url;
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div>
        <h1 className="text-4xl font-bold">Welcome to X-POST</h1>
        <p className="text-lg mt-4">
          Schedule your social media posts with ease.
        </p>
      </div>

      <Button onClick={handleClick}>Sign in </Button>
    </main>
  );
}
