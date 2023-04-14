"use client";
import Image from "next/image";
import { Inter } from "next/font/google";
import HomePage from "./components/HomePage";
const inter = Inter({ subsets: ["latin"] });
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { Web3Button } from "@web3modal/react";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { arbitrum, mainnet, polygon } from "wagmi/chains";
import { getZeroDevSigner, getSocialWalletOwner } from "@zerodevapp/sdk";

import {
  SocialWallet,
  GoogleSocialWallet,
  FacebookSocialWallet,
  GithubSocialWallet,
  DiscordSocialWallet,
  TwitchSocialWallet,
  TwitterSocialWallet,
} from "@zerodevapp/social-wallet";
import { useMemo, useState } from "react";
// ("use client");
const chains = [arbitrum, mainnet, polygon];
const projectId = "3d500e39-c888-4256-ad9c-3e3ac286a061";

const { provider } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  provider,
});
const ethereumClient = new EthereumClient(wagmiClient, chains);
const socialWallet = new GoogleSocialWallet();

export default function Home() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const socialWallet = useMemo(() => {
    return new SocialWallet();
  }, []);

  const createWallet = async () => {
    setLoading(true);
    const signer = await getZeroDevSigner({
      projectId: "3d500e39-c888-4256-ad9c-3e3ac286a061",
      owner: await getSocialWalletOwner(
        "3d500e39-c888-4256-ad9c-3e3ac286a061",
        socialWallet
      ),
    });
    setAddress(await signer.getAddress());
    setLoading(false);
  };

  const disconnect = async () => {
    await socialWallet.disconnect();
    setAddress("");
  };

  const connected = !!address;
  return (
    <div className="h-full lg:h-screen ">
      <div className="flex justify-evenly h-full items-center flex-col md:flex-row gap-8">
        <div className="h-[60%] bg-white w-80 rounded-[20px] shadow-lg flex flex-col justify-center items-center gap-8 p-8">
          <h1 className="text-center font-bold text-xl uppercase">
            Create Wallets with Social <br />
            <br />
            <span className="text-purple-600 capitalize">
              {" "}
              Using Ethers API
            </span>
          </h1>
          <div className="bg-blue-500 px-6 py-2 capitalize rounded-lg text-white font-semibold">
            {connected && (
              <div>
                <label>Wallet: {address}</label>
              </div>
            )}
            <div>
              {!connected && (
                <button onClick={createWallet} disabled={loading}>
                  {loading ? "loading..." : "Create Wallet"}
                </button>
              )}
              {connected && (
                <button onClick={disconnect} disabled={loading}>
                  Disconnect
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="h-[60%] bg-white w-80  rounded-[20px] shadow-lg flex flex-col justify-center items-center gap-8 p-8">
          <h1 className="text-center font-bold text-xl uppercase">
            Create Wallets with Social <br />
            <br />
            <span className="text-purple-600 capitalize pb-8">
              {" "}
              Using Web3Modal
            </span>
          </h1>
          <WagmiConfig client={wagmiClient}>
            <Web3Button />
          </WagmiConfig>
        </div>
      </div>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </div>
  );
}
