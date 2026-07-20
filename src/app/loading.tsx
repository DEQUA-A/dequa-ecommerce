import { Loader2 } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-3" />
        <p className="text-sm text-gray-500">در حال بارگذاری...</p>
      </div>
    </div>
  );
}
