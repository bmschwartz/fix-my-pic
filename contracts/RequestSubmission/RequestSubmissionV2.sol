// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import './BaseRequestSubmission.sol';

/**
 * @title RequestSubmissionV2
 * @dev Extended version of RequestSubmission that adds a purchaser list.
 */
contract RequestSubmissionV2 is BaseRequestSubmission {
  address[] public purchaserList;

  /**
   * @dev Initializer for RequestSubmissionV2.
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
  ) public override initializer {
    // Call the base contract initializer
    super.initialize(
      _submitter,
      _description,
      _watermarkedPictureId,
      _encryptedPictureId,
      _freePictureId,
      _price
    );
  }

  /**
   * @dev Adds a buyer to the purchasers mapping and to the purchaser list.
   * @param buyer The address of the buyer.
   */
  function addBuyer(address buyer) public override {
    super.addBuyer(buyer);
    purchaserList.push(buyer);
  }

  /**
   * @dev Returns the list of purchasers.
   * @return The addresses of purchasers.
   */
  function getPurchaserList() public view returns (address[] memory) {
    return purchaserList;
  }
}
