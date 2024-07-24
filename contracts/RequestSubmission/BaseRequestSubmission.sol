// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol';

contract BaseRequestSubmission is Initializable, ReentrancyGuardUpgradeable {
  event RequestSubmissionCreated(
    address indexed submissionId,
    address indexed requestId,
    string description,
    uint256 price,
    string freeImageId,
    string watermarkedImageId,
    string encryptedImageId,
    address indexed creator,
    uint256 createdAt
  );

  event SubmissionPurchased(
    address indexed submissionId,
    address indexed purchaser,
    uint256 purchaseDate
  );

  address public requestId;
  string public description;
  uint256 public price;
  string public freeImageId;
  string public watermarkedImageId;
  string public encryptedImageId;
  address public creator;
  uint256 public createdAt;
  mapping(address => bool) public submissionPurchasers;

  function initialize(
    address _requestId,
    string calldata _description,
    uint256 _price,
    string calldata _freeImageId,
    string calldata _watermarkedImageId,
    string calldata _encryptedImageId,
    address _creator
  ) external initializer {
    __ReentrancyGuard_init();

    requestId = _requestId;
    description = _description;
    price = _price;
    freeImageId = _freeImageId;
    watermarkedImageId = _watermarkedImageId;
    encryptedImageId = _encryptedImageId;
    creator = _creator;
    createdAt = block.timestamp;

    emit RequestSubmissionCreated(
      address(this),
      _requestId,
      _description,
      _price,
      _freeImageId,
      _watermarkedImageId,
      _encryptedImageId,
      _creator,
      block.timestamp
    );
  }

  function purchaseSubmission() external payable nonReentrant {
    require(msg.value >= price, 'Insufficient payment');
    require(!submissionPurchasers[msg.sender], 'Already purchased');

    (bool success, ) = creator.call{ value: msg.value }('');
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
