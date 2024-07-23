// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

/**
 * @title BaseIRequestSubmission
 * @dev Interface for RequestSubmission contract.
 */
interface BaseIRequestSubmission {
  function addBuyer(address buyer) external;

  function getPrice() external view returns (uint256);

  function getSubmitter() external view returns (address);
}
