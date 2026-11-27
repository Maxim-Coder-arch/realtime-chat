import type { CSSProperties, ReactNode } from "react";

import { useTheme } from "../../shared/config/themes/themes";

export const Layout = ({ children }: {children: ReactNode}) => {
    const theme = useTheme();

    const layoutStyle: CSSProperties = {
        backgroundImage: `url(${theme.background.value})`,
    }

    const tailwindClasses = "w-full flex flex-col justify-between min-h-screen bg-cover bg-center bg-no-repeat";

    return (
        <main style={layoutStyle} className={tailwindClasses}>
            { children }
        </main>
    )
}