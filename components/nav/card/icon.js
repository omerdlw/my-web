import Iconify from "@/components/icon";

export const Icon = ({ icon }) => {
  const isUrl = typeof icon === "string" && icon.startsWith("http");

  if (isUrl) {
    return (
      <div
        className="w-[52px] h-[52px] rounded-secondary bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${icon})` }}
      />
    );
  }

  return (
    <div className="flex items-center justify-center size-[52px] rounded-secondary bg-black/5 dark:bg-white/5">
      <span className="text-2xl">
        <Iconify icon={icon} />
      </span>
    </div>
  );
};
