// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

interface FlowInsightMarketplaceManager {
  function isTransferAllowed(address _from, address _to, uint256 _axieId) external returns (bool);
}