import { constants } from "../../utils/constants";
import ImageToggleButton from "../ImageToggleButton";

const CoinFlipWizardStepOneWhale = ({
  community,
  side,
  setSide,
  price,
  setPrice,
  loading,
  onDoubleOrNothing
}: any) => {
  return (
    <>
      <img className="mb-3 logo" src={constants.LOGO.Whale} alt="coin" width="128" height="128" />
      <h3 className="my-2 mt-sm-5">I LIKE</h3>
      <div className="row mb-2">
        <div className="col-6">
          <ImageToggleButton
            name="Heads"
            buttonImageSrc={community?.assets?.buttonHeads ?? constants.BUTTONS_WHALE.Heads}
            isSelected={side == "H"}
            onSelect={() => setSide("H")} />
        </div>
        <div className="col-6">
          <ImageToggleButton
            name="Tails"
            buttonImageSrc={community?.assets?.buttonTails ?? constants.BUTTONS_WHALE.Tails}
            isSelected={side == "T"}
            onSelect={() => setSide("T")} />
        </div>
      </div>
      <h3 className="mb-1">FOR</h3>
      <div className="row mb-1">
        <div className="col-4">
          <ImageToggleButton
            name="1 SOL"
            buttonImageSrc={community?.assets?.button1Sol ?? constants.BUTTONS_WHALE.OneSol}
            isSelected={price == 1}
            onSelect={() => setPrice(1)} />
        </div>
        <div className="col-4">
          <ImageToggleButton
            name="2 SOL"
            buttonImageSrc={community?.assets?.button2Sol ?? constants.BUTTONS_WHALE.TwoSol}
            isSelected={price == 2}
            onSelect={() => setPrice(2)} />
        </div>
        <div className="col-4">
          <ImageToggleButton
            name="3 SOL"
            buttonImageSrc={community?.assets?.button3Sol ?? constants.BUTTONS_WHALE.ThreeSol}
            isSelected={price == 3}
            onSelect={() => setPrice(3)} />
        </div>
      </div>
      <hr />
      {
        loading &&
        <div className="btn btn-outline-dark disabled btn-block py-2 w-100 mb-1">
          <i className="fas fa-circle-notch fa-spin"></i> FLIPPING
        </div>
      }
      {!loading &&
        <img onClick={onDoubleOrNothing}
          className="cursor-pointer double-button mb-1"
          src={community?.assets?.buttonDoubleOrNothing ?? constants.BUTTONS_WHALE.DoubleOrNothing}
          alt="double or nothing"
          width="100%"
          height="100%" />
      }
    </>
  );
};

export default CoinFlipWizardStepOneWhale;