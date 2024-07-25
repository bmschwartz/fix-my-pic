// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol';

contract BaseRequestSubmission is Initializable, ReentrancyGuardUpgradeable {
  event SubmissionPurchased(
    address indexed submission,
    address indexed purchaser,
    uint256 purchaseDate
  );

  address public request;
  address public submitter;
  uint256 public price;
  string public description;
  uint256 public createdAt;
  string public freeImageId;
  string public encryptedImageId;
  string public watermarkedImageId;
  mapping(address => bool) public submissionPurchasers;

  function initialize(
    address _request,
    string calldata _description,
    uint256 _price,
    string calldata _freeImageId,
    string calldata _watermarkedImageId,
    string calldata _encryptedImageId,
    address _submitter
  ) external initializer {
    __ReentrancyGuard_init();

    request = _request;
    description = _description;
    price = _price;
    freeImageId = _freeImageId;
    watermarkedImageId = _watermarkedImageId;
    encryptedImageId = _encryptedImageId;
    submitter = _submitter;
    createdAt = block.timestamp;
  }

  function purchaseSubmission() external payable nonReentrant {
    require(msg.value >= price, 'Insufficient payment');
    require(!submissionPurchasers[msg.sender], 'Already purchased');

    (bool success, ) = submitter.call{ value: msg.value }('');
    require(success, 'Payment failed');

    submissionPurchasers[msg.sender] = true;

    emit SubmissionPurchased(address(this), msg.sender, block.timestamp);
  }

  function hasPurchased(address _user) external view returns (bool) {
    return submissionPurchasers[_user];
  }

  function getEncryptedImageId(address _user) external view returns (string memory) {
    require(submissionPurchasers[_user], 'User has not purchased this submission');
    return encryptedImageId;
  }
}
