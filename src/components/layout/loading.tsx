export default function Loading() {
  return (
    <div className="flex justify-center mt-20" aria-label="読み込み中">
      <div className="animate-ping h-2 w-2 bg-violet-600 rounded-full"></div>
      <div className="animate-ping h-2 w-2 bg-violet-600 rounded-full mx-4"></div>
      <div className="animate-ping h-2 w-2 bg-violet-600 rounded-full"></div>
    </div>
  );
}
