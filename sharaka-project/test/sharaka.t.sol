// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/sharaka.sol";

contract SharakaTest is Test {
    Sharaka public partnership;
    address owner = address(0x100); // تغيير عنوان المالك
    address investor1 = address(0x200);
    address investor2 = address(0x300);
    
    function setUp() public {
        vm.prank(owner);
        partnership = new Sharaka();
        
        // تمويل الحسابات
        vm.deal(owner, 100 ether);
        vm.deal(investor1, 100 ether);
        vm.deal(investor2, 100 ether);
    }
    
    function testGetInvestorCount() public {
        assertEq(partnership.getInvestorCount(), 0);
        
        vm.prank(investor1);
        partnership.invest{value: 1 ether}();
        assertEq(partnership.getInvestorCount(), 1);
        
        vm.prank(investor2);
        partnership.invest{value: 1 ether}();
        assertEq(partnership.getInvestorCount(), 2);
    }
    
    function testInvestment() public {
        vm.prank(investor1);
        partnership.invest{value: 5 ether}();
        
        (uint256 investment, bool exists) = partnership.investors(investor1);
        assertEq(investment, 5 ether);
        assertTrue(exists);
        assertEq(partnership.totalInvestments(), 5 ether);
    }
    
    function testOnlyOwnerCanDistribute() public {
        vm.prank(investor1);
        vm.expectRevert("Not contract owner");
        partnership.distributeProfits{value: 1 ether}();
    }
    
    function testProfitDistribution() public {
        // استثمارات
        vm.prank(investor1);
        partnership.invest{value: 3 ether}();
        
        vm.prank(investor2);
        partnership.invest{value: 7 ether}();
        
        // توزيع الأرباح
        vm.prank(owner);
        partnership.distributeProfits{value: 10 ether}();
        
        // حساب الأرباح المتوقعة
        uint256 totalProfitForInvestors = 10 ether * 70 / 100; // 70% للمستثمرين
        uint256 investor1Share = (totalProfitForInvestors * 3 ether) / 10 ether;
        uint256 investor2Share = (totalProfitForInvestors * 7 ether) / 10 ether;
        
        assertEq(partnership.profits(investor1), investor1Share);
        assertEq(partnership.profits(investor2), investor2Share);
    }
    
    function testWithdrawProfits() public {
        // استثمار
        vm.prank(investor1);
        partnership.invest{value: 1 ether}();
        
        // توزيع الأرباح
        vm.prank(owner);
        partnership.distributeProfits{value: 1 ether}();
        
        uint256 beforeBalance = investor1.balance;
        vm.prank(investor1);
        partnership.withdrawProfits();
        
        // التحقق من زيادة الرصيد
        assertEq(investor1.balance, beforeBalance + 0.7 ether);
        
        // التحقق من إعادة تعيين الأرباح
        assertEq(partnership.profits(investor1), 0);
    }
    
    function testReentrancyProtection() public {
        // إنشاء مستثمر خبيث
        MaliciousInvestor attacker = new MaliciousInvestor(address(partnership));
        vm.deal(address(attacker), 10 ether);
        
        // استثمار
        attacker.invest{value: 1 ether}();
        
        // توزيع الأرباح
        vm.prank(owner);
        partnership.distributeProfits{value: 1 ether}();
        
        // تسجيل الأرباح قبل الهجوم
        uint256 initialProfits = partnership.profits(address(attacker));
        assertEq(initialProfits, 0.7 ether, "Initial profits should be 0.7 ether");
    

        // تنفيذ الهجوم
        uint256 initialBalance = address(attacker).balance;
        attacker.attack();
        
        // التحقق من أن المهاجم سحب مرة واحدة فقط
         assertEq(initialProfits, 700000000000000000, "Initial profits should be 0.7 ether");
    
    // التحقق من إعادة تعيين الأرباح
    assertEq(
        partnership.profits(address(attacker)), 
        0,
        "Profits should be reset to zero"
    );
    }
}

contract MaliciousInvestor {
    Sharaka public partnership;
    bool private _attack;
    
    constructor(address _partnership) {
        partnership = Sharaka(_partnership);
    }
    
    function invest() external payable {
        partnership.invest{value: msg.value}();
    }
    
    function attack() external {
        _attack = true;
        partnership.withdrawProfits();
    }
    
    receive() external payable {
        if (_attack) {
            _attack = false;
            // محاولة سحب ثانية (هجوم إعادة الدخول)
            try partnership.withdrawProfits() {
                // إذا نجح السحب الثاني، فهذا فشل في الحماية
                revert("Reentrancy succeeded!");
            } catch {
                // هذا متوقع - يجب أن يفشل السحب الثاني
            }
        }
    }
}