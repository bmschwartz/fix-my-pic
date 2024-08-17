// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

contract BaseFixMyPicNFT is Initializable, ERC721Upgradeable, OwnableUpgradeable {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  // Mapping from token ID to IPFS hash (or any other metadata)
  mapping(uint256 => string) private _tokenURIs;

  function initialize() public initializer {
    __ERC721_init('FixMyPicNFT', 'FMPNFT');
    __Ownable_init();
  }

  function mintNFT(address _recipient, string memory _tokenURI) public onlyOwner returns (uint256) {
    _tokenIds.increment();
    uint256 newItemId = _tokenIds.current();
    _mint(_recipient, newItemId);
    _setTokenURI(newItemId, _tokenURI);
    return newItemId;
  }

  function _setTokenURI(uint256 _tokenId, string memory _tokenURI) internal virtual {
    _tokenURIs[_tokenId] = _tokenURI;
  }

  function tokenURI(uint256 _tokenId) public view virtual override(ERC721Upgradeable) returns (string memory) {
    return _tokenURIs[_tokenId];
  }
}
