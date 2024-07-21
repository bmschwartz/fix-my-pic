// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import './PictureNFT.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

contract RequestSubmission is ReentrancyGuard {
  string public description;
  uint256 public price;
  address public submitter;
  PictureNFT public pictureNFT;
  string public watermarkedPictureId;
  string public encryptedPictureId;
  string public freePictureId;

  event SubmissionPurchased(address indexed buyer, uint256 indexed nftId);

  constructor(
    address _submitter,
    string memory _description,
    string memory _watermarkedPictureId,
    string memory _encryptedPictureId,
    string memory _freePictureId,
    uint256 _price,
    address _pictureNFTAddress
  ) {
    require(_price >= 0, 'Price must be positive or zero');
    require(_submitter != address(0), 'Submitter address cannot be zero');
    require(_pictureNFTAddress != address(0), 'Invalid NFT contract address');

    submitter = _submitter;
    description = _description;
    price = _price;
    pictureNFT = PictureNFT(_pictureNFTAddress);
    watermarkedPictureId = _watermarkedPictureId;
    encryptedPictureId = _encryptedPictureId;
    freePictureId = _freePictureId;
  }

  function purchaseSubmission() public payable nonReentrant {
    require(msg.value == price, 'Incorrect payment amount');

    string memory tokenURI = price == 0 ? freePictureId : encryptedPictureId;
    uint256 nftId = pictureNFT.mintNFT(msg.sender, tokenURI);

    if (price > 0) {
      // Transfer payment to the submitter
      (bool success, ) = submitter.call{ value: msg.value }('');
      require(success, 'Transfer failed');
    }

    emit SubmissionPurchased(msg.sender, nftId);
  }
}
