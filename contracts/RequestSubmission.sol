// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

/**
 * @title IRequestSubmission
 * @dev Interface for RequestSubmission contract.
 */
interface IRequestSubmission {
  function addBuyer(address buyer) external;

  function getPrice() external view returns (uint256);

  function getSubmitter() external view returns (address);
}

/**
 * @title RequestSubmission
 * @dev Manages individual submissions for a picture request.
 */
contract RequestSubmission is Initializable, IRequestSubmission {
  string public description;
  string public watermarkedPictureId;
  string public encryptedPictureId;
  string public freePictureId;
  uint256 public price;
  address public submitter;
  mapping(address => bool) public purchasers;

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
   * @dev Adds a buyer to the purchasers mapping.
   * @param buyer The address of the buyer.
   */
  function addBuyer(address buyer) external override {
    require(buyer != address(0), 'Invalid buyer address');
    purchasers[buyer] = true;
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

  /**
   * @dev Returns the price of the submission.
   * @return The price.
   */
  function getPrice() external view override returns (uint256) {
    return price;
  }

  /**
   * @dev Returns the submitter's address.
   * @return The submitter's address.
   */
  function getSubmitter() external view override returns (address) {
    return submitter;
  }
}
