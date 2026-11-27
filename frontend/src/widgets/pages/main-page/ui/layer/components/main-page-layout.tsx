import type { ReactNode } from "react";

import styles from "../../styles/main-page.module.scss";

export const MainPageLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className={`${styles["main-page-layout"]}`}>
            { children }
        </div>
    )
}