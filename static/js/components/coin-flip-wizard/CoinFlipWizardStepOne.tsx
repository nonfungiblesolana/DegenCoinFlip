import { Link } from "react-router-dom";
import { CHALLENGES, VALID_AMOUNTS } from "../../utils/constants";
import { JackpotPromo } from "../JackpotPromo";
import CoinFlipWizardStepOneDefault from "./CoinFlipWizardStepOneDefault";
import CoinFlipWizardStepOneWhale from "./CoinFlipWizardStepOneWhale";

const DCF_ID = CHALLENGES[0].id;

const CoinFlipWizardStepOne = ({
  community,
  style,
  whaleMode,
  currentWinStreak,
  price,
  setPrice,
  setSide,
  side,
  loading,
  onNext
}: any) => {
  const flipCoin = () => {
    if (!VALID_AMOUNTS.includes(price)) {
      return;
    }

    if (whaleMode && ![1, 2, 3].includes(price)) {
      return;
    }

    onNext({
      side,
      amount: price
    });
  }

  return (

    <div className="play step1 py-4 py-md-0">
      <div className="form-signin">
        <JackpotPromo style={style} />
        {/* <a href="https://twitter.com/degencoinflip"
          target="_blank"
          rel="noopener noreferrer"
          className={`text-decoration-none ${community?.id != DCF_ID ? '' : 'd-none'}`}>
          <h6 className="text-secondary">Powered by DCF Engine</h6>
        </a> */}
        {
          currentWinStreak > 1 &&
          <h3>Congrats!<br /> You're on a {currentWinStreak} win streak</h3>
        }
        {
          loading &&
          <div className="my-5 my-lg-0 py-5 py-lg-0">
            <div className="cssload-container py-5 py-lg-0">
              <div className="cssload-zenith"></div>
            </div>
          </div>
        }
        {
          !loading &&
          <>
            {
              !whaleMode &&
              <CoinFlipWizardStepOneDefault
                loading={loading}
                community={community}
                side={side}
                price={price}
                setSide={(s: any) => !loading && setSide(s)}
                setPrice={(p: any) => !loading && setPrice(p)}
                onDoubleOrNothing={flipCoin} />
            }
            {
              whaleMode &&
              <CoinFlipWizardStepOneWhale
                loading={loading}
                community={community}
                side={side}
                price={price}
                setSide={(s: any) => !loading && setSide(s)}
                setPrice={(p: any) => !loading && setPrice(p)}
                onDoubleOrNothing={flipCoin} />
            }
            <h5 className="mt-3 text-secondary">
              <Link to="/ukraine" className="ms-sm-2 ms-1 no-decoration">
                FEELING GENEROUS?&nbsp;<img src="https://flagicons.lipis.dev/flags/4x3/ua.svg" height="17px" className="mb-1"></img>
              </Link>
            </h5>
          </>
        }
      </div>
    </div>
  );
};

export default CoinFlipWizardStepOne;
