// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

contract PictureNFT is ERC721URIStorage, Ownable {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  mapping(address => bool) public minters;

  constructor() ERC721('PictureNFT', 'PNFT') {}

  modifier onlyMinters() {
    require(minters[msg.sender], 'Caller is not a minter');
    _;
  }

  function addMinter(address minter) public onlyOwner {
    minters[minter] = true;
  }

  function removeMinter(address minter) public onlyOwner {
    minters[minter] = false;
  }

  function mintNFT(address recipient, string memory tokenURI) public onlyMinters returns (uint256) {
    _tokenIds.increment();
    uint256 newItemId = _tokenIds.current();
    _safeMint(recipient, newItemId);
    _setTokenURI(newItemId, tokenURI);
    return newItemId;
  }
}
