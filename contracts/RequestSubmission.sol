// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import './PictureNFT.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

contract RequestSubmission is ReentrancyGuard {
  string public watermarkedPictureId;
  string public encryptedPictureId;
  string public freePictureId;
  string public description;
  uint256 public price;
  address public pictureRequest;
  address public submitter;
  bool public isFree;
  PictureNFT public pictureNFT;

  event RequestCreated(
    address indexed submitter,
    string description,
    uint256 price,
    string watermarkedPictureId,
    string encryptedPictureId,
    string freePictureId,
    bool isFree
  );

  event SubmissionPurchased(address indexed buyer, uint256 indexed nftId);

  constructor(
    address _submitter,
    string memory _description,
    string memory _watermarkedPictureId,
    string memory _encryptedPictureId,
    string memory _freePictureId,
    uint256 _price,
    bool _isFree,
    address _pictureNFTAddress
  ) {
    require(_price >= 0, 'Price must be positive or zero');
    require(_submitter != address(0), 'Submitter address cannot be zero');
    require(_pictureNFTAddress != address(0), 'Invalid NFT contract address');

    submitter = _submitter;
    description = _description;
    price = _price;
    watermarkedPictureId = _watermarkedPictureId;
    encryptedPictureId = _encryptedPictureId;
    freePictureId = _freePictureId;
    pictureRequest = msg.sender;
    isFree = _isFree;
    pictureNFT = PictureNFT(_pictureNFTAddress);

    emit RequestCreated(
      _submitter,
      _description,
      _price,
      _watermarkedPictureId,
      _encryptedPictureId,
      _freePictureId,
      _isFree
    );
  }

  function purchaseSubmission() public payable nonReentrant {
    require(msg.value == price, 'Incorrect payment amount');

    string memory tokenURI = isFree ? freePictureId : encryptedPictureId; // Assuming the pictureId serves as metadata
    uint256 nftId = pictureNFT.mintNFT(msg.sender, tokenURI);

    // Transfer payment to the submitter
    (bool success, ) = submitter.call{ value: msg.value }('');
    require(success, 'Transfer failed');

    emit SubmissionPurchased(msg.sender, nftId);
  }
}
