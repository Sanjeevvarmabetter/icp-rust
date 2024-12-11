
import React, { useState, useEffect } from "react";
import axios from "axios";
import { HttpAgent, Actor } from "@dfinity/agent";
import { idlFactory } from "./declarations/nft_marketplace_backend"; // Import your IDL Factory
import { Principal } from "@dfinity/principal";

// Replace with your deployed canister ID
const canisterId = "a4tbr-q4aaa-aaaaa-qaafq-cai";

const App = () => {
  const [nfts, setNfts] = useState([]);
  const [metadataUrl, setMetadataUrl] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState(null);
  const [actor, setActor] = useState(null);

  const PINATA_API_KEY = "20a1ac93e10b67f081c5";
  const PINATA_SECRET_API_KEY = "2b3680b650e07a507c4df5a9649b9b6438d7f8e4c3cc0cfab22a73bb968d02d7";


  useEffect(() => {
    const agent = new HttpAgent({ host: "http://127.0.0.1:4943" }); // Local development URL
    agent.fetchRootKey().catch((e) => {
      console.error("Failed to fetch root key:", e);
    });

    const actorInstance = Actor.createActor(idlFactory, {
      agent,
      canisterId,
    });
    setActor(actorInstance);
    fetchNFTs(actorInstance);
  }, []);


  // Fetch all NFTs
  const fetchNFTs = async (actorInstance) => {
    try {
      const allNFTs = await actorInstance.get_all_nfts();
      setNfts(allNFTs);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    }
  };

  const uploadToPinata = async (file) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const formData = new FormData();
    formData.append("file", file);

    const headers = {
      "Content-Type": "multipart/form-data",
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_SECRET_API_KEY,
    };

    try {
      const response = await axios.post(url, formData, { headers });
      return `ipfs://${response.data.IpfsHash}`;
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
      throw error;
    }
  };

  // Mint and List NFT
  const handleMint = async () => {
    if (!file) {
      alert("Please upload a file.");
      return;
    }

    try {
      const ipfsUrl = await uploadToPinata(file);
      console.log(ipfsUrl);
      const priceValue = price ? Number(price) : undefined; // Convert price to BigInt if provided
      const tokenId = await actor.mint_and_list(ipfsUrl, priceValue);
      alert(`NFT minted successfully with Token ID: ${tokenId}`);
      fetchNFTs(actor);
    } catch (error) {
      console.error("Error minting NFT:", error);
    }
  };

  // Buy NFT
  const handleBuy = async (tokenId) => {
    try {
      await actor.buy(tokenId);
      alert(`Successfully purchased NFT with Token ID: ${tokenId}`);
      fetchNFTs(actor);
    } catch (error) {
      console.error("Error buying NFT:", error);
    }
  };

  return (
      <div className="App">
        <h1>NFT Marketplace</h1>

        <div>
          <h2>Mint and List NFT</h2>
          <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              accept="image/*"
          />
          <input
              type="number"
              placeholder="Price in ICP (optional)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
          />
          <button onClick={handleMint}>Mint NFT</button>
        </div>

        <hr />

        <div>
          <h2>Available NFTs</h2>
          <ul>
            {nfts.map((nft) => (
                <li key={nft.token_id}>
                  <img
                      src={nft.metadata_url.replace("ipfs://", "https://ipfs.io/ipfs/")}
                      alt={`NFT ${nft.token_id}`}
                      style={{ width: "100px", height: "100px" }}
                  />
                  <p>Token ID: {nft.token_id}</p>
                  <p>Owner: {nft.owner}</p>
                  <p>
                    Price: {nft.price !== null ? `${nft.price} ICP` : "Not for sale"}
                  </p>
                  {nft.price !== null && (
                      <button onClick={() => handleBuy(nft.token_id)}>Buy</button>
                  )}
                </li>
            ))}
          </ul>
        </div>
      </div>
  );
};

export default App;
