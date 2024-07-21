// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

/**
 * @title RequestSubmission
 * @dev Manages individual submissions for a picture request.
 */
contract RequestSubmission is Initializable, ReentrancyGuard {
  string public description;
  string public watermarkedPictureId;
  string public encryptedPictureId;
  string public freePictureId;
  uint256 public price;
  address public submitter;
  mapping(address => bool) public purchasers;

  /**
   * @dev Emitted when a submission is purchased.
   * @param buyer The address of the buyer.
   * @param submissionAddress The address of the submission.
   */
  event SubmissionPurchased(address indexed buyer, address indexed submissionAddress);

  /**
   * @dev Initializer for RequestSubmission.
   * @param _submitter The address of the submitter.
   * @param _description The description of the submission.
   * @param _watermarkedPictureId The ID of the watermarked picture.
   * @param _encryptedPictureId The ID of the encrypted picture.
   * @param _freePictureId The ID of the free picture.
   * @param _price The price of the submission.
   */
  function initialize(
    address _submitter,
    string memory _description,
    string memory _watermarkedPictureId,
    string memory _encryptedPictureId,
    string memory _freePictureId,
    uint256 _price
  ) public initializer {
    require(_price >= 0, 'Price must be positive or zero');
    require(_submitter != address(0), 'Submitter address cannot be zero');

    submitter = _submitter;
    description = _description;
    price = _price;
    watermarkedPictureId = _watermarkedPictureId;
    encryptedPictureId = _encryptedPictureId;
    freePictureId = _freePictureId;
  }

  /**
   * @dev Purchases the submission.
   */
  function purchaseSubmission() public payable nonReentrant {
    require(msg.value == price, 'Incorrect payment amount');
    require(!purchasers[msg.sender], 'Already purchased');

    purchasers[msg.sender] = true;

    // Transfer payment to the submitter
    if (price > 0) {
      (bool success, ) = submitter.call{ value: msg.value }('');
      require(success, 'Transfer failed');
    }

    emit SubmissionPurchased(msg.sender, address(this));
  }

  /**
   * @dev Gets the picture ID for the caller.
   * @return The picture ID.
   */
  function getPictureId() public view returns (string memory) {
    if (price == 0) {
      return freePictureId;
    } else if (purchasers[msg.sender]) {
      return encryptedPictureId;
    } else {
      return watermarkedPictureId;
    }
  }
}
