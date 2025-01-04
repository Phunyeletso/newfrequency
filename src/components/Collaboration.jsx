import Section from "./Section";

const Collaboration = () => {
  return (
    <Section crosses>
      <div className="container lg:flex justify-center items-center">
        <div className="max-w-[60rem] bg-[#15131D ] p-8 rounded-md shadow-md">
          <h2 className="h2 mb-8 text-center text-white">Smart Contract Code</h2>
          <pre className="overflow-x-auto bg-[#15131D ] p-6 rounded-md text-sm text-[#E0E0E0]">
            {`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFTMarketplace is ERC721, AccessControl, ReentrancyGuard {
    // Constants for fees
    uint256 public constant PLATFORM_FEE_PERCENT = 10;   // 10% platform fee
    uint256 public constant ROYALTY_FEE_PERCENT = 10;   // 10% royalty fee

    // Platform and metadata info
    string public baseURI;
    string public baseExtension = ".json";
    address public newFrequencyAddress;

    // Roles
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        uint256 price;
        bool listed;
    }

    struct ArtistShare {
        address payable artistAddress;
        uint256 share; // In basis points (out of 10,000)
    }

    // Storage
    mapping(uint256 => MarketItem) public marketItems;
    mapping(uint256 => ArtistShare[]) public royalties;

    // Events
    event MarketItemMinted(uint256 indexed tokenId, address indexed owner, uint256 price);
    event MarketItemBought(uint256 indexed tokenId, address indexed seller, address buyer, uint256 price);
    event MarketItemRelisted(uint256 indexed tokenId, address indexed seller, uint256 price);
    event MarketItemDelisted(uint256 indexed tokenId, address indexed seller);
    event RoyaltiesUpdated(uint256 indexed tokenId, ArtistShare[] royaltyInfo);

    // Constructor
    constructor(address _newFrequencyAddress, string memory _inputURI) ERC721("MusicNFT", "MNFT") {
        require(_newFrequencyAddress != address(0), "Invalid platform address");

        newFrequencyAddress = _newFrequencyAddress;
        baseURI = _inputURI;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    // Mint token with royalties
    function mintToken(
        uint256 _tokenId,
        uint256 _price,
        address[] memory _artists,
        uint256[] memory _shares
    ) external onlyRole(MINTER_ROLE) {
        require(_price > 0, "Price must be greater than zero");
        require(_artists.length == _shares.length, "Artists and shares mismatch");

        // Mint the NFT to the contract
        _mint(address(this), _tokenId);

        // Save market item details
        marketItems[_tokenId] = MarketItem({
            tokenId: _tokenId,
            seller: payable(msg.sender),
            price: _price,
            listed: true
        });

        // Assign royalty shares
        uint256 totalShares = 0;
        for (uint256 i = 0; i < _artists.length; i++) {
            require(_artists[i] != address(0), "Invalid artist address");
            require(_shares[i] > 0, "Share must be positive");

            royalties[_tokenId].push(
                ArtistShare(payable(_artists[i]), _shares[i])
            );
            totalShares += _shares[i];
        }
        require(totalShares == 10000, "Total shares must be 100%");

        emit MarketItemMinted(_tokenId, msg.sender, _price);
        emit RoyaltiesUpdated(_tokenId, royalties[_tokenId]);
    }

    // Buy token
    function buyToken(uint256 _tokenId) external payable nonReentrant {
        MarketItem storage item = marketItems[_tokenId];
        require(item.listed, "Token not listed for sale");
        require(msg.value == item.price, "Incorrect price sent");

        // Calculate fee splits
        uint256 platformFee = (msg.value * PLATFORM_FEE_PERCENT) / 100;
        uint256 royaltyPool = (msg.value * ROYALTY_FEE_PERCENT) / 100;
        uint256 sellerProceeds = msg.value - platformFee - royaltyPool;

        // Pay the seller
        item.seller.transfer(sellerProceeds);

        // Pay the platform
        payable(newFrequencyAddress).transfer(platformFee);

        // Distribute royalties
        for (uint256 i = 0; i < royalties[_tokenId].length; i++) {
            ArtistShare memory artistShare = royalties[_tokenId][i];
            uint256 payout = (royaltyPool * artistShare.share) / 10000;
            artistShare.artistAddress.transfer(payout);
        }

        // Transfer ownership
        item.seller = payable(address(0));
        item.listed = false;
        _transfer(address(this), msg.sender, _tokenId);

        emit MarketItemBought(_tokenId, item.seller, msg.sender, item.price);
    }

    // Resell token
    function resellToken(uint256 _tokenId, uint256 _price) external nonReentrant {
        require(ownerOf(_tokenId) == msg.sender, "Caller must own the token");
        require(_price > 0, "Price must be greater than zero");

        marketItems[_tokenId] = MarketItem({
            tokenId: _tokenId,
            seller: payable(msg.sender),
            price: _price,
            listed: true
        });

        _transfer(msg.sender, address(this), _tokenId);

        emit MarketItemRelisted(_tokenId, msg.sender, _price);
    }

    // Delist token
    function delistToken(uint256 _tokenId) external nonReentrant {
        MarketItem storage item = marketItems[_tokenId];
        require(item.seller == msg.sender, "Caller is not the seller");
        require(item.listed, "Token already delisted");

        item.listed = false;
        _transfer(address(this), msg.sender, _tokenId);

        emit MarketItemDelisted(_tokenId, msg.sender);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}`}
          </pre>
        </div>
      </div>
    </Section>
  );
};

export default Collaboration;


