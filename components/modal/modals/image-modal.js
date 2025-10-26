export default function ImageModal({ data }) {
  return (
    <div>
      <img className="rounded-primary" src={data?.image} alt="Image" />
    </div>
  );
}
