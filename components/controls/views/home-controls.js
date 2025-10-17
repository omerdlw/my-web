import { useModal } from "@/contexts/modal-context";

export default function HomeControls() {
  const { openModal } = useModal();

  return (
    <div className="w-full h-full flex space-x-3">
      <div className="w-full h-full flex items-center justify-end space-x-3"></div>
      <div className="w-[300px] h-full shrink-0"></div>
      <div className="w-full h-full flex items-center justify-start space-x-3"></div>
    </div>
  );
}
