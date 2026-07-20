export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">داشبورد</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "کل فروش", value: "۰ تومان", color: "bg-blue-500" },
          { label: "سفارشات امروز", value: "۰", color: "bg-green-500" },
          { label: "محصولات", value: "۰", color: "bg-purple-500" },
          { label: "کاربران", value: "۰", color: "bg-orange-500" },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-xl border p-4">
            <div className={`w-10 h-10 rounded-lg ${item.color} mb-3`} />
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="text-xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
