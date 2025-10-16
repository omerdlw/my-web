import Icon from "@/components/icon";

export default function Loading() {
  return (
    <div className="h-screen w-screen center p-4">
      <div className="animate-spin">
        <Icon spin icon="mingcute:loading-3-fill" size={40} />
      </div>
    </div>
  );
}
