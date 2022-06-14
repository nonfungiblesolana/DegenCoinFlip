import { Modal } from "react-bootstrap";
import { isMobile } from 'react-device-detect';

const URL_1 = "https://magiceden.io/marketplace/justape";
const URL_2 = "https://magiceden.io/marketplace/ghostface_gen_2";

export const openInNewTab = (url) => {
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
  // console.log(newWindow);
  if (newWindow) newWindow.opener = null
};

export function JackpotModal({ walletId, styleCss, ...props }) {

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      contentClassName={styleCss + `-color`}
      centered
    >
      <Modal.Body className={"p-0"}>
        <div className="card card-user shadow-lg">
          <div className={"card-body p-4" + (styleCss === 'dark' ? ' pb-0' : '')} style={{ maxHeight: '484px', overflow: 'scroll' }}>
            <h4>Bi-Monthly Degen Jackpot</h4>
            <img src="https://i.imgur.com/jkfPG3Y.jpg" className="img-fluid mb-1"></img>
            <h6 className="text-center mt-2">June 9th - June 16th</h6>
            <hr className="mt-2" />
            <h5 className="text-center mb-4">
              1 Whale Winner:
              <br />
              3 x Just Apes NFTS<br />
              <div className="d-flex justify-content-center me-3" >
                <div className="d-flex align-items-center justify-content-center bg-light rounded-circle" style={{ width: '86px', height: '86px' }}>
                  <img src="https://i.imgur.com/xbhQS4z.jpg" className="rounded border cursor-pointer button-fx" onClick={() => openInNewTab(URL_1)} width={86} alt="Avatar" />
                </div>
                <div className="d-flex align-items-center justify-content-center bg-light rounded-circle shadow" style={{ width: '86px', height: '86px', marginLeft: '-0.5rem' }}>
                  <img src="https://i.imgur.com/HLufvPV.jpg" className="rounded border cursor-pointer button-fx" onClick={() => openInNewTab(URL_1)} width={86} alt="Avatar" />
                </div>
                <div className="d-flex align-items-center justify-content-center bg-light rounded-circle shadow" style={{ width: '86px', height: '86px', marginLeft: '-0.5rem' }}>
                  <img src="https://i.imgur.com/GiWS0cJ.jpg" className="rounded border cursor-pointer button-fx" onClick={() => openInNewTab(URL_1)} width={86} alt="Avatar" />
                </div>
              </div>
              <br />
              <small>(30 SOL floor Total)</small>
            </h5>
            <hr />
            <h5 className="text-center mb-4">
              3 Normal Winners:
              <br />
              1 x Ghost Face NFTs <br />
              <div className="d-flex justify-content-center me-3">
                <div className="d-flex align-items-center justify-content-center bg-light rounded-circle" style={{ width: '86px', height: '86px' }}>
                  <img src="https://i.imgur.com/K8VSTub.jpg" className="rounded border cursor-pointer button-fx" onClick={() => openInNewTab(URL_2)} width={86} alt="Avatar" />
                </div>
                <div className="d-flex align-items-center justify-content-center bg-light rounded-circle shadow" style={{ width: '86px', height: '86px', marginLeft: '-0.5rem' }}>
                  <img src="https://i.imgur.com/X2YYrrl.jpg" className="rounded border cursor-pointer button-fx" onClick={() => openInNewTab(URL_2)} width={86} alt="Avatar" />
                </div>
                <div className="d-flex align-items-center justify-content-center bg-light rounded-circle shadow" style={{ width: '86px', height: '86px', marginLeft: '-0.5rem' }}>
                  <img src="https://i.imgur.com/LTwEEff.jpg" className="rounded border cursor-pointer button-fx" onClick={() => openInNewTab(URL_2)} width={86} alt="Avatar" />
                </div>
              </div>              <br />
              <small>(5 SOL ea)</small>
            </h5>
            <hr />
            <u>To Enter</u>: <br />
            Hit a 3 win or lose streak = 1 entry.
            <br />
            Hit a 5 win or lose streak = 3 entries
            <br />
            Hit a 7 win or lose streak = 5 entries.
            <br />
            Whale entries only added to the Whale Prize pool.
            <br />
            <br />
            <u>Whale Mode Definition:</u><br />
            Any 1 SOL flip or more is a whale flip. Whale flips and normal flips have separated streak counts.
            <br /><br />
            <u>How do I check entries?</u><br />
            Come into discord and type <b><i>!entries (wallet)</i></b>.<br/><br/>It will also show up under your sol amount in the top right corner and count all entries from June 9th.
          </div>
          <div className="card-footer">
            <button
              className="btn btn-block w-100 btn-lg my-2 rounded-0 btn-warning"
              onClick={() => { localStorage.setItem('lotto_june', true); props.onHide() }}>
              OKAY
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
