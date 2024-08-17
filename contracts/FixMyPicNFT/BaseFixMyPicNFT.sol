// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';

contract BaseFixMyPicNFT is Initializable, ERC721URIStorageUpgradeable, OwnableUpgradeable {
  uint256 private _tokenIdCounter;

  function initialize() public initializer {
    __ERC721_init('FixMyPicNFT', 'FMPNFT');
    __Ownable_init();
    _tokenIdCounter = 1; // Start token IDs from 1 for clarity
  }

  function mintNFT(address _recipient, string memory _tokenURI) public onlyOwner returns (uint256) {
    uint256 newItemId = _tokenIdCounter;
    _tokenIdCounter += 1;

    _safeMint(_recipient, newItemId);
    _setTokenURI(newItemId, _tokenURI);

    return newItemId;
  }

  function _burn(uint256 tokenId) internal virtual override(ERC721URIStorageUpgradeable) {
    super._burn(tokenId);
  }

  function tokenURI(uint256 tokenId) public view virtual override(ERC721URIStorageUpgradeable) returns (string memory) {
    return super.tokenURI(tokenId);
  }
}
