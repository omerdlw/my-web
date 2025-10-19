export default function ImageModal({ data }) {
  return (
    <div>
      <img className="rounded-[20px]" src={data?.image} alt="Image" />
    </div>
  );
}
