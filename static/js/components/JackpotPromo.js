import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "../utils/fetcher";
import { JackpotModal } from "./modals/JackpotModal";

const BASE_URL = 'https://live-api.degencoinflip.com/api/promos/jackpots';

export const JackpotPromo = ({ style }) => {
  const wallet = useWallet();
  const [showModal, setShowModal] = useState(false);
  // const [jackpotAmount, setJackpotAmount] = useState(30);
  // const [jackpotData, setJackpotData] = useState({
  //   computedAt: null,
  //   currentPool: null,
  //   previousPool: null
  // });
  // const { data, error } = useSWR(
  //   BASE_URL,
  //   fetcher,
  //   {
  //     revalidateIfStale: false,
  //     revalidateOnFocus: false,
  //     revalidateOnReconnect: false,
  //   }
  // );

  // useEffect(() => {
  //   if (!error && !!data) {
  //     setJackpotData(data);
  //     setJackpotAmount(Math.max(data?.currentPool?.first, 30).toFixed(2))
  //   } else {
  //     setJackpotAmount(30);
  //   }
  // }, [data, error]);

  const handleModalOpen = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);
  return (
    <>

      <h4 onClick={handleModalOpen} className="cursor-pointer">
        JACKPOT:&nbsp;
        <img src="https://i.imgur.com/xbhQS4z.jpg" className="img-fluid mb-1 ms-1 rounded border button-fx" style={{ maxWidth: '46px' }} />
        <img src="https://i.imgur.com/LTwEEff.jpg" className="img-fluid mb-1 ms-1 rounded border button-fx" style={{ maxWidth: '46px' }} />
      </h4>
      <hr />
      {
        showModal &&
        <JackpotModal
          show={showModal}
          walletId={wallet?.publicKey?.toString()}
          styleCss={style}
          onHide={() => handleModalClose()}
        />
      }
    </>
  );
}