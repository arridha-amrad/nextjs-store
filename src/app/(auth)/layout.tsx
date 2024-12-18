import ThemeSwitcher from "@/components/ThemeSwitcher";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <main className="regular">
      {children}
      <div className="fixed bottom-5 right-5">
        <ThemeSwitcher />
      </div>
    </main>
  );
}
