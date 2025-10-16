export default function Background({ background }) {
  return (
    <>
      <div
        className="fixed w-screen h-screen inset-0 -z-10 bg-cover bg-top bg-no-repeat"
        style={{ backgroundImage: `url(${background})` }}
      ></div>
      <div className="fixed w-screen h-screen inset-0 -z-10 dark:bg-gradient-to-t dark:from-black dark:via-black/80 dark:to-black/50 bg-gradient-to-t from-white via-white/80 to-white/50"></div>
    </>
  );
}
