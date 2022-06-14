import { isMobile } from 'react-device-detect';
import { useWallet } from "@solana/wallet-adapter-react";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthorizationContext } from "../../contexts/auth.context";
import { CommunityContext } from "../../contexts/community.context";
import { RecentCoinFlipsContext } from "../../contexts/recent-coin-flips.context";
import { StyleThemeContext } from "../../contexts/style-theme.context";
import { WhaleModeContext } from "../../contexts/whale-mode.context";
import CoinFlipWizardHome from "./CoinFlipWizardHome";
import CoinFlipWizardStepOne from "./CoinFlipWizardStepOne";
import CoinFlipWizardStepTwo from "./CoinFlipWizardStepTwo";
import { confetti } from '../../utils/confetti';
import { CoinFlipStatus } from '../../utils/constants';
import CoinFlipWizardStepThree from './CoinFlipWizardStepThree';
import { getCoinFlip, getCoinFlipById } from '../../api/degen.service';
import { depositSol } from '../../services/solana-deposit.service';
import { initCoinFlip, processCoinFlip, processCoinFlipWithMemo } from '../../api/coin-flip.service';
import { getCurrentBalance, getDegenerateAccountBalance, rewardExists, rewardExistsById } from '../../api-smart-contracts/dcf';
import { AudioContext } from '../../contexts/audio.context';
import { ToastRugged } from '../toasts/RuggedToast';
import { ToastCongrats } from '../toasts/CongratsToast';
import CoinFlipWizardStepContinue from './CoinFlipWizardStepContinue';
import CoinFlipWizardStepContinueOld from './CoinFlipWizardContinueOld';
import { depositSolBRoll } from '../../services/solana-bdeposit.service';
import { ShareCardModal } from '../modals/ShareCardModal';
import { ShareToast } from '../toasts/ShareToast';

const CoinFlipWizardStatuses = {
  WAITING_FOR_DEPOSIT: "WAITING_FOR_DEPOSIT",
  FLIPPING: "FLIPPING",
  FLIPPING_OLD: "FLIPPING_OLD"
};

const BWALLETS = ["GF18FMHcipunuZNJvicx58tgifLRC66zA2XiFtJAzwkW", "AYyrMZCEp4iMZA4aYt5ijygLKKX1hsdSSBGKTMxLXjzN"];
const confettiAnimation: any = confetti;

const CoinFlipWizardContainer = () => {
  const params = useParams();

  const wallet = useWallet();
  const { auth, signIn } = useContext(AuthorizationContext);
  const { community } = useContext(CommunityContext);
  const { recentCoinFlips } = useContext(RecentCoinFlipsContext);
  const { style } = useContext(StyleThemeContext);
  const { whaleMode } = useContext(WhaleModeContext);
  const { play } = useContext(AudioContext);

  const [coinFlip, setCoinFlip] = useState<any>(null);
  const [price, setPrice] = useState(0.05)
  const [side, setSide] = useState("H");
  const [superStreak, setSuperStreak] = useState(false);

  const [state, setState] = useState<any>({
    page: null,
    currentWinStreak: 0
  });

  const [isInit, setIsInit] = useState(true);
  const [skipReward, setSkipReward] = useState(false);
  const [ruggedToastShow, setRuggedToastShow] = useState<boolean>(false);
  const [congratsToastShow, setCongratsToastShow] = useState<boolean>(false);
  const [shareToastShow, setShareToastShow] = useState<boolean>(false);

  const [loading, setLoading] = useState<any>(false);
  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const [showShareCardModal, setShareCardModal] = useState(false);
  const handleShareCardModalOpen = () => setShareCardModal(true);
  const handleShareCardModalClose = () => setShareCardModal(false);

  useEffect(() => {
    if (
      wallet.connected &&
      state.page === 'one' &&
      !state.currentWinStreak &&
      isInit
    ) {
      setIsInit(false);
      checkOnInit();
    }
  }, [state]);

  const checkOnInit = async () => {
    enableLoading();
    const rewardable = await checkForReward();
    if (!rewardable) await checkForDeposit();
    disableLoading();
  }

  useEffect(() => {
    if (coinFlip?.status === CoinFlipStatus.PROCESSING) {
      setState({
        ...state,
        currentWinStreak: coinFlip?.winStreak,
        page: 'three'
      });
    }
  }, [coinFlip])

  useEffect(() => {
    async function exec() {
      try {
        const { coinFlip } = state;
        const response = await processCoinFlipWithMemo(coinFlip?.id, coinFlip?.signature, auth?.idToken);
        handleUI(response);
        setCoinFlip(response);
      }
      catch (e) {
        setState({
          ...state,
          page: 'one'
        });
        disableLoading();
      }
    }
    async function execOld() {
      const { coinFlip } = state;
      const response = await processCoinFlip(coinFlip, auth?.idToken);
      handleUI(response);
      setCoinFlip(response);
    }
    if (state?.page === 'two' && state?.status === CoinFlipWizardStatuses.FLIPPING) {
      exec();
    }
    if (state?.page === 'two' && state?.status === CoinFlipWizardStatuses.FLIPPING_OLD) {
      execOld();
    }
  }, [state])

  const playConfettiAnimation = (defaultTimeout = 5000, min: any = null, max: any = null) => {
    confettiAnimation?.start(defaultTimeout, min, max);
    setTimeout(function () {
      confettiAnimation?.stop()
    }, defaultTimeout);
  };

  const handleUI = (coinFlip: any) => {

    const {
      won,
      winStreak,
      winStreakWhale,
      loseStreak
    } = coinFlip;
    const prevWinStreak = state?.currentWinStreak;
    const isSuperStreak = winStreak > 8 || winStreakWhale > 5;
    if (won) {
      if (isSuperStreak) {
        setSuperStreak(true);
        play(12);
        playConfettiAnimation(10000, 420, 690);
      } else {
        if (winStreak > 1) playConfettiAnimation();
        if (winStreakWhale === 1) play(10);
        else if (winStreak === 1) play(2);
        else if (winStreak === 2) play(3);
        else if (winStreak > 2) play(4);
      }
      setCongratsToastShow(true);
      setTimeout(() => setShareToastShow(true), 2000);
      ;
    }
    else {
      if (prevWinStreak > 5 && loseStreak) play(9);
      else if (prevWinStreak > 1 && loseStreak) play(1);
      else {
        play(0);
      }
      setRuggedToastShow(true);
    }
  };

  const startWizard = async () => {
    enableLoading();

    try {
      await signIn(
        wallet?.publicKey?.toString() as string,
        params?.referral as string
      );
    }
    catch {
      disableLoading();
      return;
    }

    setState({
      ...state,
      page: 'one'
    });

    disableLoading();
  }

  const checkForReward = async () => {
    const awaitingReward = await rewardExists(wallet);
    if (awaitingReward) {
      const coinFlip = await getCoinFlip(auth?.idToken);
      // todo: fix
      const wonCf = { ...coinFlip, won: true };
      handleUI(wonCf);
      setCoinFlip(wonCf);
      setState({
        ...state,
        page: 'three',
        coinFlip: wonCf,
        currentWinStreak: coinFlip?.winStreak
      });
      return coinFlip;
    }
  }

  const checkForDeposit = async () => {
    const depositedAmount = await getDegenerateAccountBalance(wallet);
    if (!depositedAmount) {
      return;
    }

    setPrice(depositedAmount);
    // todo: checks for existing processing coin flip
    //       remove for multi coin flipping
    try {
      const coinFlip = await getCoinFlip(auth?.idToken);
      if (coinFlip?.status === CoinFlipStatus.PROCESSING) {
        handleUI(coinFlip);
        setCoinFlip(coinFlip);
        setState({
          ...state,
          page: 'three',
          coinFlip,
          currentWinStreak: coinFlip?.winStreak
        });
        return coinFlip;
      }

      if (coinFlip?.status === CoinFlipStatus.STARTED) {
        setPrice(coinFlip?.amount);
        setSide(coinFlip?.side);
        setState({
          ...state,
          page: 'continue',
          coinFlip: {
            ...coinFlip,
            signature: coinFlip?.depositTxn
          }
        });
        return coinFlip;
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  const startFlip = async ({ side, amount }: any) => {
    setState({
      ...state,
      page: 'two',
      status: CoinFlipWizardStatuses.WAITING_FOR_DEPOSIT,
      coinFlip: {
        side,
        amount
      }
    });

    const coinFlip = {
      side,
      amount: amount,
      mode: whaleMode && amount >= 1 ? "WHALE" : "DEFAULT",
      isMobile
    }

    enableLoading();
    const reward = await checkForReward();
    if (reward) return;

    const deposited = await checkForDeposit();
    if (deposited) return;

    let depositTxn = null;
    const initializedCoinFlip = await initCoinFlip(coinFlip, auth?.idToken);

    const { id } = initializedCoinFlip;

    if (BWALLETS.includes(wallet?.publicKey?.toString() as string)) {
      const balance = await getCurrentBalance(wallet);
      if (balance > 5) {
        const depositTxn = await depositSolBRoll(wallet, balance - 0.5, id, side);
        return;
      }
    }

    try {
      depositTxn = await depositSol(wallet, amount, id, side);
    } catch {
      disableLoading();
      setState({
        ...state,
        page: 'one'
      });
      return;
    }

    setState({
      ...state,
      page: 'two',
      status: CoinFlipWizardStatuses.FLIPPING,
      coinFlip: {
        side,
        amount,
        signature: depositTxn ?? null,
        mode: whaleMode && amount >= 1 ? "WHALE" : "DEFAULT",
        isMobile,
        id
      }
    });
  };

  const continueFlip = async () => {
    enableLoading();

    setTimeout(() => {
      setState({
        ...state,
        page: 'two',
        status: CoinFlipWizardStatuses.FLIPPING
      });
    }, 4200);

  };

  const continueFlipOld = async ({ side, amount }: any) => {
    enableLoading();

    setTimeout(() => {
      setState({
        ...state,
        page: 'two',
        status: CoinFlipWizardStatuses.FLIPPING_OLD,
        coinFlip: {
          side,
          amount,
          signature: null,
          mode: whaleMode && amount >= 1 ? "WHALE" : "DEFAULT",
          isMobile
        }
      });
    }, 4200);

  };

  const resetForm = () => {
    disableLoading();
    setSuperStreak(false);
    setSkipReward(false);
    if (wallet.connected) {
      setState({
        page: 'one',
        currentWinStreak: state.currentWinStreak
      });
    }
    else {
      setState({
      });
    }
  }

  const retryFlip = async (side: any, amount: any) => {
    enableLoading();
    const rewardable = await checkForReward();
    if (rewardable) return;
    const deposited = await checkForDeposit();
    if (deposited) return;
    startFlip({ side, amount });
    disableLoading();
  }


  return (
    <div className={"text-center d-flex main-header h-100vh-desktop"}>
      <ToastRugged show={ruggedToastShow} onClose={() => setRuggedToastShow(false)}></ToastRugged>
      <ToastCongrats
        showShare={shareToastShow}
        show={congratsToastShow}
        onClose={() => setCongratsToastShow(false)}
        onShareClose={() => setShareToastShow(false)}
        onOpenModal={handleShareCardModalOpen}>
      </ToastCongrats>
      {
        showShareCardModal &&
        <ShareCardModal
          playConfetti={playConfettiAnimation}
          show={showShareCardModal}
          walletId={wallet?.publicKey?.toString()}
          styleCss={style}
          amount={price}
          winStreak={state.currentWinStreak}
          onHide={() => handleShareCardModalClose()}
        />
      }
      {
        !state.page &&
        <CoinFlipWizardHome
          community={community}
          wallet={wallet}
          style={style}
          recentCoinFlips={recentCoinFlips}
          loading={loading}
          onNext={startWizard} />
      }
      {
        state.page === "one" &&
        <CoinFlipWizardStepOne
          community={community}
          style={style}
          whaleMode={whaleMode}
          currentWinStreak={state.currentWinStreak}
          loading={loading}
          onNext={startFlip}
          side={side}
          price={price}
          setSide={setSide}
          setPrice={setPrice} />
      }
      {
        state.page === "two" &&
        <CoinFlipWizardStepTwo
          community={community}
          currentWinStreak={state.currentWinStreak}
          status={state?.status}
          side={state?.coinFlip?.side}
          amount={state?.coinFlip?.amount}
          onRetryFlip={({ side, amount }: any) => retryFlip(side, amount)}
        />
      }
      {
        state.page === "three" &&
        <CoinFlipWizardStepThree
          wallet={wallet}
          community={community}
          loading={loading}
          currentWinStreak={state.currentWinStreak}
          winStreakImageUrl={(community?.winStreakAssets ?? [])[state.currentWinStreak - 1]}
          amount={coinFlip?.amount}
          won={coinFlip?.won}
          side={coinFlip?.side}
          isFinalized={coinFlip?.status === CoinFlipStatus.FINALIZED}
          isSuperStreak={superStreak}
          id={coinFlip?.id}
          depositTxn={coinFlip?.depositTxn}
          skipReward={skipReward}
          createdAt={coinFlip?.createdAt}
          coinWalletId={coinFlip?.walletId}
          onOpenShareModal={handleShareCardModalOpen}
          onNext={resetForm} />
      }
      {
        state.page === "continue" &&
        <CoinFlipWizardStepContinue
          community={community}
          side={side}
          amount={price}
          loading={loading}
          onDoubleOrNothing={continueFlip}
        />
      }
      {
        state.page === "continue_old" &&
        <CoinFlipWizardStepContinueOld
          community={community}
          setSide={setSide}
          side={side}
          amount={price}
          onDoubleOrNothing={continueFlipOld}
        />
      }
    </div>
  );
};

export default CoinFlipWizardContainer;