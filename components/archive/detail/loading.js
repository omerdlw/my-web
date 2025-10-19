import Icon from "@/components/icon";

export function LoadingState() {
  return (
    <div className="h-screen w-screen flex items-center justify-center p-4 bg-white dark:bg-black">
      <div className="animate-spin text-black dark:text-white">
        <Icon spin icon="mingcute:loading-3-fill" size={40} />
      </div>
    </div>
  );
}
