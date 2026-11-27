import { MainPageLayout } from "./components/main-page-layout";

import { ChatPanel } from "./chat-panel/chat-panel";

export const MainPage = () => {
    return (
        <MainPageLayout>
            <ChatPanel title="chat a" />
            <ChatPanel title="chat b" />
        </MainPageLayout>
    )
}