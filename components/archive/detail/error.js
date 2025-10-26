"use client"; // Client component olduğunu belirtmek önemli

import { useRouter } from "next/navigation";
import Icon from "@/components/icon";

export function ErrorState({
  message = "The requested details could not be loaded.",
}) {
  const router = useRouter();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center text-center text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900 px-4">
      <Icon
        icon="solar:sad-square-bold-duotone"
        className="mb-4 text-red-500 dark:text-red-400"
        size={60}
      />
      <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">
        Oops! Something went wrong.
      </h2>
      <p className="max-w-md">
        {message} Please check the URL or try again later.
      </p>
      <button
        onClick={handleGoBack}
        className="mt-6 bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 text-black dark:text-white px-5 py-2.5 rounded-2xl transition-colors font-medium" // padding ve font ayarlandı
      >
        Go Back
      </button>
    </div>
  );
}
