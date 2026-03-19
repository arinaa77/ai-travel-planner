export default function Topbar() {
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
      <div className="text-2xl font-black tracking-tight">
        <span className="bg-gradient-to-r from-violet-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
          TripAgent
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button className="px-5 py-2 text-sm font-semibold border-2 border-gray-200 rounded-full text-gray-500 hover:border-gray-300 hover:bg-gray-50 transition-all">
          My trips
        </button>
        <button className="px-5 py-2 text-sm font-semibold border-2 border-gray-200 rounded-full text-gray-500 hover:border-gray-300 hover:bg-gray-50 transition-all">
          History
        </button>
        <button className="px-5 py-2 text-sm font-bold rounded-full text-white bg-gradient-to-r from-violet-500 to-pink-500 hover:opacity-90 transition-all shadow-sm">
          New trip ✈︎
        </button>
      </div>
    </header>
  );
}
