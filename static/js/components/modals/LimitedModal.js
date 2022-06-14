import { Modal } from "react-bootstrap";

export function LimitedModal({ styleCss, ...props }) {
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
                    <div className={"card-body p-4" + (styleCss === 'dark' ? ' pb-0' : '')}>
                        <h4 className="">DAILY GIVEAWAYS</h4>
                        <img src="https://i.imgur.com/n6O3viX.png" className="img-fluid mb-1"></img>
                        <br />
                        <br />
                        <p className="font-weight-bold mb-0 ">
                            We've created discord giveaway bot that rewards real players and we're giving away 2 SOL a day minimum for the rest of June.
                            <br />
                            <br />
                            <a href="https://discord.gg/degencoinflip" target="_blank" rel="noopener noreferrer">Come join us!</a>
                        </p>
                    </div>
                    <div className="card-footer">
                        <button
                            className="btn btn-block w-100 btn-lg my-2 rounded-0 btn-warning"
                            onClick={props.onClose}>
                            CLOSE
                        </button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}