// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

import '../IRequestSubmission.sol';

/**
 * @title BaseRequestSubmission
 * @dev Manages individual submissions for a picture request.
 */
contract BaseRequestSubmission is Initializable, IRequestSubmission {
  string public description;
  string public watermarkedPictureId;
  string public encryptedPictureId;
  string public freePictureId;
  uint256 public price;
  address public submitter;
  mapping(address => bool) public purchasers;

  /**
   * @dev Initializer for BaseRequestSubmission.
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
  ) public virtual initializer {
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
  function addBuyer(address buyer) public virtual override {
    require(buyer != address(0), 'Invalid buyer address');
    purchasers[buyer] = true;
  }

  /**
   * @dev Returns the price of the submission.
   * @return The price.
   */
  function getPrice() public view virtual override returns (uint256) {
    return price;
  }

  /**
   * @dev Returns the submitter's address.
   * @return The submitter's address.
   */
  function getSubmitter() public view virtual override returns (address) {
    return submitter;
  }
}
