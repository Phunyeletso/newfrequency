import Section from "./Section";

const Services = () => {
  return (
    <Section id="contract-explanation">
      <div className="flex items-center justify-center min-h-screen bg-[#15131D]">
        <div className="max-w-[60rem] bg-[#15131D] p-8 rounded-md shadow-md text-white text-center">
          <h2 className="text-2xl mb-8 italic">Explanation of the NFT Marketplace Contract</h2>
          <p className="text-lg mb-6 italic">
            This contract, titled "NFTMarketplace," is designed to facilitate the creation, sale, and resale of NFTs (Non-Fungible Tokens) with built-in royalties for artists. Below, we break down its key features in plain English to make it accessible for all users.
          </p>

          <ul className="list-disc list-inside text-left">
            <li className="mb-4">
              <span className="font-bold">Platform Fees:</span> The contract charges a 10% platform fee for each NFT sale, ensuring the sustainability of the marketplace.
            </li>

            <li className="mb-4">
              <span className="font-bold">Royalty Fees:</span> Artists earn a 10% royalty on each resale of their NFTs, distributed automatically to the listed collaborators.
            </li>

            <li className="mb-4">
              <span className="font-bold">Minting NFTs:</span> Authorized users (with the MINTER role) can create new NFTs by specifying the price, token ID, and royalty shares among artists.
            </li>

            <li className="mb-4">
              <span className="font-bold">Buying NFTs:</span> Buyers can purchase listed NFTs by sending the exact price to the contract. The platform fee is deducted, and the remaining amount is distributed to the seller and artists as per the royalty terms.
            </li>

            <li className="mb-4">
              <span className="font-bold">Reselling NFTs:</span> Owners can relist their purchased NFTs on the marketplace by specifying a new price. The relisting transfers the NFT back to the contract until sold.
            </li>

            <li className="mb-4">
              <span className="font-bold">Delisting NFTs:</span> Sellers can withdraw their NFTs from the marketplace if they decide not to sell them anymore.
            </li>

            <li className="mb-4">
              <span className="font-bold">Roles and Security:</span> The contract uses roles (like MINTER) to restrict who can mint NFTs. It also employs security measures like reentrancy protection to ensure safe transactions.
            </li>

            <li className="mb-4">
              <span className="font-bold">Base URI:</span> The contract supports metadata storage with a customizable Base URI, ensuring compatibility with platforms displaying NFTs.
            </li>
          </ul>

          <p className="text-lg mt-6 italic">
            This contract ensures a transparent and secure marketplace for creators and collectors, making it simple to buy, sell, and earn from digital assets while rewarding artists fairly.
          </p>

          <p className="text-lg mt-6 italic">
            Note: Smart contracts are immutable, meaning once signed according to the agreements shown, they cannot be changed. You are bound by the agreement forever, adhering to the principle that "code is law," ensuring fairness and reliability for all parties.
          </p>
        </div>
      </div>
    </Section>
  );
};

export default Services;
