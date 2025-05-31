// script/Deploy.s.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/Sharaka.sol";

contract Deploy is Script {
    function run() external {
        vm.startBroadcast();
        new Sharaka();
        vm.stopBroadcast();
    }
}
