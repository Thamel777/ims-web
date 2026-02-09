"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-wrapper">
                <Navbar />
                <main className="content-area">
                    {children}
                </main>
            </div>

            <style jsx>{`
        .dashboard-layout {
          display: flex;
          min-height: 100vh;
          background-color: rgb(var(--background));
        }

        .main-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0; /* Prevent flex blowout */
          height: 100vh;
        }

        .content-area {
            flex: 1;
            overflow-y: auto;
            padding: 2rem;
        }
        
        @media (max-width: 768px) {
            .dashboard-layout {
                flex-direction: column;
            }
        }
      `}</style>
        </div>
    );
}
