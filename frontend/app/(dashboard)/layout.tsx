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
      <div className="flex w-full min-h-screen">
        <Sidebar />
        <main className="flex min-w-0 flex-1 flex-col bg-[#F8FAFC]">
          {children}
        </main>
        <FloatingAiChat />
      </div>
    </AuthGuard>
  );
}
