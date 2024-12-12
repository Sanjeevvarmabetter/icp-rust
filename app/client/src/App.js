import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { HttpAgent, Actor } from "@dfinity/agent";
import { idlFactory } from "./declarations/nft_marketplace_backend"; // Import your IDL Factory
import Navigation from "./components/Nav";
import Create from "./pages/Create";  // Ensure this page is created
import { Principal } from "@dfinity/principal";
import "./App.css"
const canisterId = "a4tbr-q4aaa-aaaaa-qaafq-cai";

const App = () => {
  const [nfts, setNfts] = useState([]);
  const [actor, setActor] = useState(null);

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
      <Router>
        <div className="App">
          <Navigation />
          <hr />

          <Routes>
            <Route path="/" element={
              <div className="container">
                <h2>Available NFTs</h2>
                <div className="row">
                  {nfts.map((nft) => (
                      <div className="col-md-4" key={nft.token_id}>
                        <div className="card mb-4">
                          <img
                              src={nft.metadata_url.replace("ipfs://", "https://ipfs.io/ipfs/")}
                              className="card-img-top"
                              alt={`NFT ${nft.token_id}`}
                              style={{ height: "200px", objectFit: "cover" }}
                          />
                          <div className="card-body">
                            <h5 className="card-title">Token ID: {nft.token_id}</h5>
                            <p className="card-text">Owner: {nft.owner}</p>
                            <p className="card-text">
                              Price: {nft.price !== null ? `${nft.price} ICP` : "Not for sale"}
                            </p>
                            {nft.price !== null && (
                                <button className="btn btn-primary" onClick={() => handleBuy(nft.token_id)}>
                                  Buy
                                </button>
                            )}
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
            } />
            <Route path="/create" element={<Create actor={actor} fetchNFTs={fetchNFTs} />} />
          </Routes>
        </div>
      </Router>
  );
};
export default App;