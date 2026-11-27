import type { ReactNode } from "react";

export const Layout = ({ children }: {children: ReactNode}) => {
    return (
        <main className="w-full flex flex-col justify-between min-h-screen">
            { children }
        </main>
    )
}