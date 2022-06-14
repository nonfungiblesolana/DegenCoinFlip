import { useContext } from "react";
import { Outlet } from "react-router-dom";
import { isMobile } from "react-device-detect";

import { StyleThemeContext } from "../../../contexts/style-theme.context";
import { CommunityContext } from "../../../contexts/community.context";
import { RecentCoinFlipsProvider } from "../../../contexts/recent-coin-flips.context";
import { SocialBar, ToolBar } from "../../components";
import MenuBar from "../../components/menu-bar";
import { TopCoinFlipsProvider } from "../../../contexts/top-coin-flips.context";
import InfoBar from "../../components/info-bar";

const ClassicLayout = () => {
    const { style } = useContext(StyleThemeContext);
    const { community } = useContext(CommunityContext);

    const bgImageUrl = isMobile ? community?.backgroundImageMobile ?? community?.backgroundImage : community?.backgroundImage;
    return (
        <div className={style}>
            <div className={"classic-container h-sm-100" + (bgImageUrl?.length ? ' bg-image' : '')}
                style={{
                    backgroundImage: `url(${style === 'light' ?
                        bgImageUrl :
                        (
                            community?.backgroundImageDark ??
                            bgImageUrl
                        )}`
                }}>
                <RecentCoinFlipsProvider>
                    <TopCoinFlipsProvider>
                        <MenuBar></MenuBar>
                        <Outlet></Outlet>
                        <ToolBar></ToolBar>
                        <InfoBar social={community}></InfoBar>
                    </TopCoinFlipsProvider>
                </RecentCoinFlipsProvider>
            </div>
        </div>
    );
};
export default ClassicLayout;