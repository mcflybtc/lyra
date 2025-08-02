
export default function InfoCard({ title, children }) {
  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-3xl shadow-lg p-6 h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div>{children}</div>
    </div>
  );
}
