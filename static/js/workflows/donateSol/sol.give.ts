import { Idl, Program, BN, web3, utils } from '@project-serum/anchor';
import { getSolanaProvider } from "../../services/solana";
import idl from './op_bountiful.json';
import { LAMPORTS_PER_SOL, SYSVAR_INSTRUCTIONS_PUBKEY } from '@solana/web3.js';
import { getDegenCoinFlipDegenerateAccount, getDegenCoinFlipHouseState, getDegenCoinFlipHouseTreasury, getDegenCoinFlipRewardsAccount } from '../../utils/accounts';
import { INITIALIZER_ID, AUTHORITY_ID, FUNDS_ID } from '../../utils/program-constants';
import moize from 'moize';
import { ERRORS } from '../../utils/constants';

const MMCC_CHALLENGE_ID = "2e40f832-9c3f-4c90-b208-43d37afcab95";

const {
    SystemProgram,
    Keypair,
    SYSVAR_RENT_PUBKEY,
    PublicKey,
    SYSVAR_CLOCK_PUBKEY
} = web3;

let programID: any;
let program: any;
let provider: any;

const init = moize((wallet: any = null) => {
    if (program) return;
    programID = new PublicKey(idl.metadata.address);
    provider = getSolanaProvider(wallet);
    program = new Program(idl as Idl, programID, provider);
});

const getProvider = moize(() => {
    if ("solana" in window) {
        const anyWindow: any = window;
        const provider = anyWindow.solana;
        if (provider.isPhantom) {
            return provider;
        }
    }
    window.open("https://phantom.app/", "_blank");
});


export const handler = async (event: any, wallet: any) => {
    init(wallet);
    const amount = event?.give?.amount;
    let tx;
    try {
        tx = await program.rpc.give(
            new BN(amount * LAMPORTS_PER_SOL),
            {
                accounts: {
                    payer: provider.wallet.publicKey,
                    fund: FUNDS_ID,
                    systemProgram: SystemProgram.programId
                }
            }
        );
    }
    catch (e) {
        throw ERRORS.DONATION_FAILED;
    }

    return {
        ...event,
        give: {
            amount,
            tx
        }
    };
};
