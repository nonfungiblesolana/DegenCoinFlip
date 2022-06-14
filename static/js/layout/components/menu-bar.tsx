import { useWallet } from "@solana/wallet-adapter-react";
import { useContext, useEffect, useState } from "react";
import { Dropdown, OverlayTrigger, Popover } from "react-bootstrap";

import { useInterval } from "../../hooks/useInterval";
import { getCurrentBalance } from '../../api-smart-contracts/dcf';
import { FlipRow } from "../../components/FlipRow";
import { RecentCoinFlipsContext } from "../../contexts/recent-coin-flips.context";
import { CommunityContext } from "../../contexts/community.context";
import { ProfileModal } from "../../components/modals/ProfileModal";
import { ProfileContext } from "../../contexts/profile.context";
import { StyleThemeContext } from "../../contexts/style-theme.context";
import { TopCoinFlipsContext } from "../../contexts/top-coin-flips.context";
import { FlipRowPlaceholder } from "../../components/FlipRowPlaceholder";
import { AcceptTermsModal } from "../../components/modals/AcceptTermsModal";
import { loadState, saveState } from "../../utils/localStorage";
import { AuthorizationContext } from "../../contexts/auth.context";
import { DateTime } from "luxon";
import { LimitedModal } from "../../components/modals/LimitedModal";
import { isMobile } from "react-device-detect";
import { JackpotModal } from "../../components/modals/JackpotModal";
import { getJackpotEligibility } from "../../api/live-api.service";

const DEFAULT_INTERVAL = 5000;

const SLOW_INTERVAL = 30000;
const LOTTO_KEY = "lotto_june";
const REQUIRED_STREAKS = [3, 5, 7];
const STREAKS_MULTIPLIER: any = {
  '3': 1,
  '5': 3,
  '7': 5
};

const impl = {
  reduceToEntriesCount: (eligibilityObject: any) => {
    return REQUIRED_STREAKS.map(streak => {
      const multiplier = STREAKS_MULTIPLIER[streak];
      const [winEntries, lossEntries] = eligibilityObject[streak];
      return (winEntries + lossEntries) * multiplier;
    }).reduce((previousValue, currentValue) => previousValue + currentValue);
  }
};


const MenuBar = () => {
  const wallet: any = useWallet();

  const { auth, signOut } = useContext(AuthorizationContext);
  const { style } = useContext(StyleThemeContext);
  const { recentCoinFlips, fetch } = useContext(RecentCoinFlipsContext);
  const { topCoinFlips, fetchTop } = useContext(TopCoinFlipsContext);
  const { community } = useContext(CommunityContext);
  const { profile, fetchProfile, updateProfile } = useContext(ProfileContext);

  const [listType, setListType] = useState<any>();
  const [currentBalance, setCurrentBalance] = useState(0);
  const [walletCache, setWalletCache] = useState('');

  const [normalEntries, setNormalEntries] = useState<number>();
  const [whaleEntries, setWhaleEntries] = useState<number>();

  const [showJackpotModal, setShowJackpotModal] = useState(false);
  const handleJackpotModalOpen = () => setShowJackpotModal(true);
  const handleJackpotModalClose = () => setShowJackpotModal(false);

  const [showProfileModal, setShowProfileModal] = useState(false);
  const handleProfileModalClose = () => setShowProfileModal(false);
  const handleProfileModalOpen = () => setShowProfileModal(true);

  const [showTermsModal, setShowTermsModal] = useState(false);
  const handleTermsModalOpen = () => setShowTermsModal(true);
  const handleTermsModalClose = () => setShowTermsModal(false);

  const [showGiveawayModal, setShowGiveawayModal] = useState(false);
  const handleGiveawayModalOpen = () => setShowGiveawayModal(true);
  const handleGiveawayModalClose = () => setShowGiveawayModal(false);

  useEffect(() => {
    (async () => {
      if (
        !wallet ||
        !wallet.publicKey ||
        !wallet.connected ||
        wallet.publicKey.toString() == walletCache
      ) {
        return;
      }
      setWalletCache(wallet.publicKey.toString());
      fetchProfile(wallet.publicKey.toString());
      // const tdy = DateTime.utc().toLocaleString();
      // if (!loadState(tdy)) {
      //   handleGiveawayModalOpen();
      //   saveState(true, tdy);
      // }
      if (!loadState(LOTTO_KEY)) {
        handleJackpotModalOpen();
        saveState(true, LOTTO_KEY);
      }
      fetchJackpotPromo(wallet.publicKey.toString());
    })();
  }, [wallet]);


  const fetchJackpotPromo = async (walletId: string) => {
    const { normal, whale } = await getJackpotEligibility(walletId);
    setNormalEntries(impl.reduceToEntriesCount(normal));
    setWhaleEntries(impl.reduceToEntriesCount(whale));
  }
  const JackpotRafflesEntryInfo = () => {
    useInterval(async () => {
      if (wallet?.publicKey?.toString()) {
        fetchJackpotPromo(wallet?.publicKey?.toString());
      }
    }, SLOW_INTERVAL);
    return (
      <>
        {
          normalEntries != null && normalEntries >= 0 &&
          <h5 className="mt-1 balance-text mb-0">
            <img src="https://i.imgur.com/NSU0AQo.png" className="img-fluid mb-1" style={{ maxWidth: '32px' }} /> {normalEntries}
          </h5>
        }
        {isMobile && <span>&nbsp;·&nbsp;</span>}
        {
          whaleEntries != null && whaleEntries >= 0 &&
          <h5 className="mt-1 balance-text mb-0">
            🐳 {whaleEntries}
          </h5>
        }
      </>
    );
  };

  const BalanceStatusInfo = () => {
    useInterval(async () => {
      if (wallet?.publicKey?.toString()) {
        const balance = await getCurrentBalance(wallet);
        setCurrentBalance(balance);
      }
    }, DEFAULT_INTERVAL);

    return (
      <>
        {
          currentBalance > 0 &&
          <h5 className="mt-1 balance-text mb-0">
            SOL {currentBalance?.toFixed(5)}
          </h5>
        }
      </>
    );
  };

  const CoinFlipsList = () => {
    const DEFAULT_INTERVAL = 4000;
    useInterval(async () => {
      fetch();
    }, DEFAULT_INTERVAL);

    return (
      <ul className="list-group mt-1 leaderboard-list border ms-auto">
        {
          recentCoinFlips?.map((flip: any) => {
            return (
              <FlipRow
                flip={flip}
                type=''
                key={flip.id}
                defaultProfilePicture={community?.coinImageUrl}
                slug={''}></FlipRow>
            )
          })
        }
        {
          !recentCoinFlips?.length && new Array(10).fill(null).map((key) => {
            return <FlipRowPlaceholder key={key} />
          })
        }
      </ul>
    );
  };

  const TopCoinFlipsList = () => {
    return (
      <ul className="list-group mt-1 leaderboard-list border ms-auto">
        {
          topCoinFlips?.map((flip: any) => {
            return (
              <FlipRow
                flip={flip}
                type=''
                key={flip.id}
                defaultProfilePicture={community?.coinImageUrl}
                slug={''}></FlipRow>
            )
          })
        }
        {
          !topCoinFlips?.length && new Array(10).fill(null).map((key) => {
            return <FlipRowPlaceholder key={key} />
          })
        }
      </ul>
    );
  };

  const RecentButton = () => {
    return (
      <a className="ms-sm-2 ms-1 cursor-pointer">
        <button className={"btn " + (listType === 'recent' ? "btn-outline-dark" : "btn-dark")} onClick={async () => {
          if (listType !== 'recent') {
            fetch();
            setListType('recent');
          }
          else setListType(null)
        }}>
          RECENT <i className="d-none d-sm-inline-flex fas fa-caret-down fa-xs"></i>
        </button>
      </a>
    );
  };

  const WinStreaksButton = () => {
    return (
      <a className="ms-sm-2 ms-1 cursor-pointer">
        <button className={"btn " + (listType === 'top' ? "btn-outline-dark" : "btn-dark")} onClick={async () => {
          if (listType !== 'top') {
            fetchTop();
            setListType('top');
          }
          else setListType(null)
        }}>
          TOP <span className="d-none d-sm-inline-flex">STREAKS</span> <i className="d-none d-sm-inline-flex fas fa-trophy fa-xs"></i>
        </button>
      </a>
    );
  };

  const LivePlaysButton = () => {
    return (
      <a
        href={`https://live.degencoinflip.com/`}
        target="_blank" rel="noopener noreferrer"
        className="ms-sm-2 ms-1">
        <button className="btn btn-dark">
          <span className="d-none d-sm-inline-flex">LIVE </span>
          PLAYS <i className="d-none d-sm-inline-flex fas fa-external-link-alt fa-xs"></i>
        </button>
      </a>
    );
  };

  const StatsButton = () => {
    return (
      <>
        <Dropdown className="ms-sm-2 ms-1">
          <Dropdown.Toggle variant="dark" id="dropdown-basic">
            STATS <i className="d-none d-sm-inline-flex fas fa-chart-bar fa-xs"></i>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <OverlayTrigger
              trigger={['hover', 'focus']}
              placement="bottom"
              overlay={
                <Popover id="popover-trigger-hover-focus" title="Popover bottom">
                  <img className="" src="https://i.imgur.com/ecVlYa2.png" alt="stats" width="100%" height="100%" />
                </Popover>}
            >
              <Dropdown.Item
                href={`https://mixpanel.com/public/KQMKc744sGRZMq3idvsBmK/`}
                target="_blank" rel="noopener noreferrer">TODAY'S STATS</Dropdown.Item>
            </OverlayTrigger>
            <Dropdown.Item
              href={`https://leaderboard.degencoinflip.com/`}
              target="_blank" rel="noopener noreferrer">LEADERBOARD</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </>
    );
  };

  const ProfileButton = () => {
    const CustomDropdownToggle = ({ onClick }: any) => {
      return <>
        <div className="ms-sm-2 ms-1 profile-picture-md" onClick={onClick}>
          <img className={`image rounded-circle cursor-pointer border border-2`}
            src={profile?.profileImageUrl ?? community?.coinImageUrl}
            alt={'pfp'} />
        </div>
      </>
    };
    return (
      <>
        <CustomDropdownToggle onClick={handleProfileModalOpen}></CustomDropdownToggle>
        {/* <Dropdown align={{ sm: "end" }} className="ms-sm-2 ms-1">
          <Dropdown.Toggle as={CustomDropdownToggle} id="dropdown-basic">
          </Dropdown.Toggle>

          <Dropdown.Menu  >
            <Dropdown.Item
              onClick={handleProfileModalOpen}
              target="_blank" rel="noopener noreferrer">EDIT PROFILE</Dropdown.Item>
            <Dropdown.Item onClick={() => { wallet.disconnect(); signOut(); }}>DISCONNECT WALLET</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown> */}
      </>
    );
  }

  const ButtonsRow = () => {
    return (
      <div className="d-flex flex-row mb-2 toolbar">
        <RecentButton />
        <WinStreaksButton />
        <StatsButton />
        <LivePlaysButton />
        {wallet?.connected && auth?.username === wallet?.publicKey?.toString() && <ProfileButton />}
      </div>
    );
  }

  return (
    <div className="social-icons" style={{ zIndex: 10 }}>
      <div className="d-flex flex-row flex-sm-column justify-content-start align-items-center">
        <div className="mt-3 d-flex flex-column shortcut-row" style={{ zIndex: 1 }}>
          <ButtonsRow />
          <div className={"" + (isMobile ? "d-inline-flex justify-content-center align-items-center" : "")}>
            {wallet?.connected && <BalanceStatusInfo />}
            {isMobile && <div className="mx-1"> - </div>}
            {wallet?.connected && !listType?.length && <JackpotRafflesEntryInfo />}
          </div>
          {listType === 'recent' && <CoinFlipsList />}
          {listType === 'top' && <TopCoinFlipsList />}
          {
            showProfileModal &&
            <ProfileModal
              show={showProfileModal}
              wallet={wallet}
              profile={profile}
              defaultProfilePicture={community.coinImageUrl}
              onHide={handleProfileModalClose}
              setProfile={updateProfile}
              styleCss={style}
            />
          }
          {
            showTermsModal &&
            <AcceptTermsModal
              show={showTermsModal}
              onClose={handleTermsModalClose}
              styleCss={style}
            />
          }
          {
            showGiveawayModal &&
            <LimitedModal
              show={showGiveawayModal}
              onClose={handleGiveawayModalClose}
              styleCss={style}
            />
          }
          {
            showJackpotModal &&
            <JackpotModal
              show={showJackpotModal}
              walletId={wallet?.publicKey?.toString()}
              styleCss={style}
              onHide={() => handleJackpotModalClose()}
            />
          }
        </div>
      </div>
    </div>
  );
};

export default MenuBar;