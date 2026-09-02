import { Sidebar } from "@/components/layout/Sidebar";
import { FloatingAiChat } from "@/components/chat/FloatingAiChat";
import { AuthGuard } from "@/components/layout/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex w-full h-screen overflow-hidden">
        <Sidebar />
        <main className="flex min-w-0 flex-1 flex-col bg-[#F8FAFC] overflow-y-auto">
          {children}
        </main>
        <FloatingAiChat />
      </div>
    </AuthGuard>
  );
}
