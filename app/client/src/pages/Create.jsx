// Create.jsx
import React, { useState } from "react";
import axios from "axios";
import "../App.css"
const PINATA_API_KEY = "20a1ac93e10b67f081c5";
const PINATA_SECRET_API_KEY = "2b3680b650e07a507c4df5a9649b9b6438d7f8e4c3cc0cfab22a73bb968d02d7";

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

const Create = ({ actor, fetchNFTs }) => {
    const [file, setFile] = useState(null);
    const [price, setPrice] = useState("");

    const handleMint = async () => {
        if (!file) {
            alert("Please upload a file.");
            return;
        }

        try {
            const ipfsUrl = await uploadToPinata(file);
            const priceValue = price ? [BigInt(price)] : [];
            const tokenId = await actor.mint_and_list(ipfsUrl, priceValue);
            alert(`NFT minted successfully with Token ID: ${tokenId}`);
            fetchNFTs();
        } catch (error) {
            console.error("Error minting NFT:", error);
        }
    };

    return (
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
    );
};

export default Create;
