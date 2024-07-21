// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import './PictureRequest.sol';

/**
 * @title PictureRequestFactory
 * @dev Factory contract to create and manage picture requests.
 */
contract PictureRequestFactory {
  PictureRequest[] public pictureRequests;

  /**
   * @dev Emitted when a new PictureRequest is created.
   * @param pictureRequestAddress The address of the new PictureRequest contract.
   */
  event PictureRequestCreated(address indexed pictureRequestAddress);

  /**
   * @dev Creates a new PictureRequest.
   * @param _title The title of the picture request.
   * @param _description The description of the picture request.
   * @param _imageId The image ID for the picture request.
   * @param _budget The budget for the picture request.
   */
  function createPictureRequest(
    string memory _title,
    string memory _description,
    string memory _imageId,
    uint256 _budget
  ) public {
    PictureRequest pictureRequest = new PictureRequest(_title, _description, _imageId, _budget);
    pictureRequests.push(pictureRequest);
    emit PictureRequestCreated(address(pictureRequest));
  }

  /**
   * @dev Returns the addresses of all PictureRequests.
   * @return An array of PictureRequest addresses.
   */
  function getPictureRequests() public view returns (address[] memory) {
    address[] memory requestAddresses = new address[](pictureRequests.length);
    for (uint i = 0; i < pictureRequests.length; i++) {
      requestAddresses[i] = address(pictureRequests[i]);
    }
    return requestAddresses;
  }
}
