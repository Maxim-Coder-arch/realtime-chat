import { MainPageLayout } from "./components/main-page-layout";

import { ChatPanel } from "./chat-panel";

export const MainPage = () => {
    return (
        <MainPageLayout>
            <ChatPanel title="Mark" side="a" />
            <ChatPanel title="Tony" side="b" />
        </MainPageLayout>
    )
}