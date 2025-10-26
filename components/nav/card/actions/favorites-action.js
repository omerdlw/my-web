import { useFavorites } from "@/hooks/use-favorites";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

function Component() {
  const { selectedSection } = useFavorites();
  const router = useRouter();

  const handleClick = (event) => {
    event.stopPropagation();
    router.push("/archive");
  };

  if (selectedSection === "games") {
    return null;
  }

  return (
    <div
      className="h-auto rounded-secondary mt-2.5 w-full flex items-center p-3 gap-3 bg-black/5 dark:bg-white/5 hover:bg-skin-primary group transition-colors duration-200 ease-linear"
      onClick={handleClick}
    >
      <div className="w-full focus:outline-none text-center group-hover:text-white">
        view my archive
      </div>
    </div>
  );
}

const FavoritesAction = dynamic(() => Promise.resolve(Component), {
  ssr: false,
});
export default FavoritesAction;
