// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

contract FixMyPicNFT is ERC721URIStorage, Ownable {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIdCounter;

  // Mapping to store encrypted URLs
  mapping(uint256 => string) private _encryptedUrls;

  // Event to log the minting of a new NFT
  event Minted(address indexed to, uint256 indexed tokenId, string tokenURI, string encryptedUrl);

  constructor() ERC721('FixMyPicNFT', 'FMP') {}

  /**
   * @dev Mints a new NFT safely and assigns it to the recipient with a tokenURI and an encrypted URL.
   * @param recipient The address of the recipient.
   * @param tokenURI The URI of the token metadata.
   * @param encryptedUrl The encrypted URL of the original image.
   */
  function safeMint(
    address recipient,
    string memory tokenURI,
    string memory encryptedUrl
  ) external onlyOwner {
    uint256 tokenId = _tokenIdCounter.current();
    _safeMint(recipient, tokenId);
    _setTokenURI(tokenId, tokenURI);
    _encryptedUrls[tokenId] = encryptedUrl;
    _tokenIdCounter.increment();

    emit Minted(recipient, tokenId, tokenURI, encryptedUrl);
  }

  /**
   * @dev Returns the token URI for a given token ID.
   * @param tokenId The ID of the token.
   * @return The token URI.
   */
  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    require(_exists(tokenId), 'ERC721URIStorage: URI query for nonexistent token');
    return super.tokenURI(tokenId);
  }

  /**
   * @dev Returns the encrypted URL for a given token ID. Only the owner or approved address can call this function.
   * @param tokenId The ID of the token.
   * @return The encrypted URL.
   */
  function getEncryptedUrl(uint256 tokenId) external view returns (string memory) {
    require(_isApprovedOrOwner(_msgSender(), tokenId), 'ERC721: caller is not owner nor approved');
    return _encryptedUrls[tokenId];
  }
}
