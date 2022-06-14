import { Provider } from '@project-serum/anchor';
import { Commitment, ConfirmOptions, Connection, clusterApiUrl, ConnectionConfig } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { RPC_URL } from '../utils/constants';

// const URL = RPC_URL;
// const URL = clusterApiUrl("devnet");
const URL = process.env.REACT_APP_RPC_URL ?? clusterApiUrl("devnet");
const DEFAULT_TIMEOUT_IN_MS = 120000;

const opts = {
  preflightCommitment: "confirmed",
  commitment: "confirmed"
};

export function getSolanaProvider(wallet: any, commitment: any = opts.commitment, preflightCommitment: any = opts.preflightCommitment) {
  const options = {
    preflightCommitment,
    commitment,
    confirmTransactionInitialTimeout: DEFAULT_TIMEOUT_IN_MS,
    skipPreflight: true
  };

  const connection = new Connection(URL, options as ConnectionConfig);
  return new Provider(connection, wallet, options as ConfirmOptions);
}