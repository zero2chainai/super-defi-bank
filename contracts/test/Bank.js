const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Bank", function () {
    let Bank, bank, owner, addr1, addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        Bank = await ethers.getContractFactory("Bank");
        bank = await Bank.deploy();
        await bank.waitForDeployment();
    });

    it("should allow deposit", async function () {
        await bank.connect(addr1).deposit({ value: ethers.parseEther("1") });
        expect(await bank.getBalance(addr1.address)).to.be.closeTo(
            ethers.parseEther("1"),
            ethers.parseEther("0.001")
        );
    });

    it("should check for 0 deposit", async function () {
        await expect(
            bank.connect(addr1).deposit({ value: ethers.parseEther("0") })
        ).to.be.revertedWithCustomError(bank, "ZeroDeposit");
    });

    it("should allow withdraw", async function () {
        await bank.connect(addr1).deposit({ value: ethers.parseEther("1") });
        await bank.connect(addr1).withdraw(ethers.parseEther("0.3"));
        const balance = await bank.connect(addr1).getBalance(addr1.address);
        expect(balance).to.be.closeTo(
            ethers.parseEther("0.7"),
            ethers.parseEther("0.001")
        );
    });

    it("should check for withdrawal amount greater than deposit balance", async function () {
        await bank.connect(addr1).deposit({ value: ethers.parseEther("1") });
        await expect(
            bank.connect(addr1).withdraw(ethers.parseEther("1.1"))
        ).to.be.revertedWithCustomError(bank, "InsufficientBalance");
    });

    it("should allow transfer", async function () {
        await bank.connect(addr1).deposit({ value: ethers.parseEther("1") });
        await bank.connect(addr1).transfer(addr2.address, ethers.parseEther("0.3"));

        const balance1 = await bank.connect(addr1).getBalance(addr1.address);
        const balance2 = await bank.connect(addr2).getBalance(addr2.address);

        expect(balance1).to.be.closeTo(
            ethers.parseEther("0.7"),
            ethers.parseEther("0.001")
        );
        expect(balance2).to.be.closeTo(
            ethers.parseEther("0.3"),
            ethers.parseEther("0.001")
        );
    });

    it("should check for transfer amount greater than deposit balance", async function () {
        await bank.connect(addr1).deposit({ value: ethers.parseEther("1") });
        await expect(
            bank.connect(addr1).transfer(addr2.address, ethers.parseEther("1.1"))
        ).to.be.revertedWithCustomError(bank, "InsufficientBalance");
    });

    it("should check for 0 address", async function () {
        await bank.connect(addr1).deposit({ value: ethers.parseEther("1") });
        await expect(
            bank.connect(addr1).transfer(ethers.ZeroAddress, ethers.parseEther("0.3"))
        ).to.be.revertedWithCustomError(bank, "InvalidAddress");
    });

    it("should get the balance", async function () {
        await bank.connect(addr1).deposit({ value: ethers.parseEther("1") });
        const balance = await bank.connect(addr1).getBalance(addr1.address);
        expect(balance).to.be.closeTo(
            ethers.parseEther("1"),
            ethers.parseEther("0.001")
        );
    });

    it("should get the total balance", async function() {
        await bank.connect(addr1).deposit({ value: ethers.parseEther("1") });
        await bank.connect(addr2).deposit({ value:  ethers.parseEther("1") });
        const totalBalance = await bank.connect(addr1).getContractBalance();
        expect(totalBalance).to.be.closeTo(
            ethers.parseEther("2"),
            ethers.parseEther("0.001")
        );
    });

    it("should accrue interest on deposit over time", async function() {
        await bank.connect(addr1).deposit({ value: ethers.parseEther("1") });

        await ethers.provider.send("evm_increaseTime", [15768000]); // 6 Months in seconds
        await ethers.provider.send("evm_mine");

        await bank.connect(addr1).deposit({ value: ethers.parseEther("0.5") });

        const balance = await bank.connect(addr1).getBalance(addr1.address);

        // Expected interest: 1 ETH * 10% * 0.5 years = 0.05 ETH
        // Total balance: 1 ETH + 0.5 ETH + 0.05 ETH = 1.55 ETH
        expect(balance).to.be.closeTo(
            ethers.parseEther("1.55"),
            ethers.parseEther("0.001")
        );
    });

    it("should accrue interest on withdraw over time", async function() {
        await bank.connect(addr1).deposit({ value: ethers.parseEther("1") });

        await ethers.provider.send("evm_increaseTime", [7884000]); // 3 Months in seconds
        await ethers.provider.send("evm_mine");

        await bank.connect(addr1).withdraw(ethers.parseEther("0.5"));

        const balance = await bank.connect(addr1).getBalance(addr1.address);

        // Interest for 3 months: 1 ETH * 10% * 0.25 years = 0.025 ETH
        // Remaining Balance: 1 + 0.025 ETH - 0.5 ETH = 0.525 ETH
        expect(balance).to.be.closeTo(
            ethers.parseEther("0.525"),
            ethers.parseEther("0.001")
        );
    });

    it("should accrue interest on transfer over time", async function() {
        await bank.connect(addr1).deposit({ value: ethers.parseEther("1") });

        await ethers.provider.send("evm_increaseTime", [7884000]); // 3 Months in seconds
        await ethers.provider.send("evm_mine");

        await bank.connect(addr1).transfer(addr2.address, ethers.parseEther("0.5"));

        const balance1 = await bank.connect(addr1).getBalance(addr1.address);
        const balance2 = await bank.connect(addr2).getBalance(addr2.address);

        // Interest for 3 months: 1 ETH * 10% * 0.25 years = 0.025 ETH
        // Remaining Balance: 1 + 0.025 ETH - 0.5 ETH = 0.525 ETH
        expect(balance1).to.be.closeTo(
            ethers.parseEther("0.525"),
            ethers.parseEther("0.001")
        );
        expect(balance2).to.be.closeTo(
            ethers.parseEther("0.5"),
            ethers.parseEther("0.001")
        );
    });

    it("should correctly update balance after multiple interactions", async function() {
        await bank.connect(addr1).deposit({ value: ethers.parseEther("1") });

        await ethers.provider.send("evm_increaseTime", [7884000]); // 3 Months in seconds
        await ethers.provider.send("evm_mine");

        await bank.connect(addr1).deposit({ value: ethers.parseEther("0.5") });

        await ethers.provider.send("evm_increaseTime", [15768000]); // 6 Months in seconds
        await ethers.provider.send("evm_mine");

        await bank.connect(addr1).withdraw(ethers.parseEther("0.5"));

        const balance = await bank.connect(addr1).getBalance(addr1.address);

        /*
            Balance Calculation:

            1) First 3 months on 1 ETH:
                1 ETH * 10% * 0.25 years = 0.025 ETH
                Balance after interest + 0.5 ETH deposit = 1 ETH + 0.025 ETH + 0.5 ETH = 1.525 ETH
            
            2) Next 6 months on 1.525 ETH:
                1.525 ETH * 10% * 0.5 years = 0.07625 ETH
                Balance before withdraw = 1.525 ETH + 0.07625 ETH = 1.60125 ETH

            3) Withdraw 0.5 ETH:
                Balance = 1.60125 ETH - 0.5 ETH = 1.10125 ETH

        */
        expect(balance).to.be.closeTo(
            ethers.parseEther("1.10125"),
            ethers.parseEther("0.00001")
        );
    });
});