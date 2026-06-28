export default function StatusBadge({ status }: { status: string }) {
  const published = status === "published";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
        published
          ? "bg-green-100 text-green-700"
          : "bg-yellow-100 text-yellow-700"
      }`}
    >
      {published ? "Published" : "Draft"}
    </span>
  );
}
