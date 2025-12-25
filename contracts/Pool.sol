// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./LPToken.sol";

contract Pool is ReentrancyGuard {
    IERC20 public immutable tokenA;
    IERC20 public immutable tokenB;
    LPToken public immutable lpToken;

    uint256 public reserveA;
    uint256 public reserveB;

    uint256 public constant FEE_NUMERATOR = 997;   // 0.3% fee
    uint256 public constant FEE_DENOMINATOR = 1000;

    /* ---------- EVENTS ---------- */

    event Mint(address indexed sender, uint256 amountA, uint256 amountB);
    event Burn(address indexed sender, uint256 amountA, uint256 amountB);
    event Swap(
        address indexed sender,
        address indexed tokenIn,
        uint256 amountIn,
        uint256 amountOut
    );

    constructor(address _tokenA, address _tokenB) {
        require(_tokenA != _tokenB, "Identical tokens");

        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);

        lpToken = new LPToken(
            "AMM LP Token",
            "AMM-LP",
            address(this)
        );
    }

    /* ---------- LIQUIDITY ---------- */

    function addLiquidity(uint256 amountA, uint256 amountB)
        external
        nonReentrant
        returns (uint256 liquidity)
    {
        require(amountA > 0 && amountB > 0, "Invalid amounts");

        uint256 _reserveA = reserveA;
        uint256 _reserveB = reserveB;
        uint256 totalSupply = lpToken.totalSupply();

        if (_reserveA == 0 && _reserveB == 0) {
            liquidity = _sqrt(amountA * amountB);
        } else {
            liquidity = _min(
                (amountA * totalSupply) / _reserveA,
                (amountB * totalSupply) / _reserveB
            );
        }

        require(liquidity > 0, "Insufficient liquidity");

        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transferFrom(msg.sender, address(this), amountB);

        reserveA = _reserveA + amountA;
        reserveB = _reserveB + amountB;

        lpToken.mint(msg.sender, liquidity);

        emit Mint(msg.sender, amountA, amountB);
    }

    function removeLiquidity(uint256 liquidity)
        external
        nonReentrant
        returns (uint256 amountA, uint256 amountB)
    {
        require(liquidity > 0, "Invalid liquidity");

        uint256 totalSupply = lpToken.totalSupply();

        amountA = (liquidity * reserveA) / totalSupply;
        amountB = (liquidity * reserveB) / totalSupply;

        lpToken.burn(msg.sender, liquidity);

        reserveA -= amountA;
        reserveB -= amountB;

        emit Burn(msg.sender, amountA, amountB);

        tokenA.transfer(msg.sender, amountA);
        tokenB.transfer(msg.sender, amountB);
    }

    /* ---------- SWAP (LP FEES ACCRUED SAFELY) ---------- */

    function swap(
        address tokenIn,
        uint256 amountIn,
        uint256 minAmountOut,
        uint256 deadline
    )
        external
        nonReentrant
        returns (uint256 amountOut)
    {
        require(block.timestamp <= deadline, "Expired");
        require(amountIn > 0, "Invalid amount");

        bool isAToB = tokenIn == address(tokenA);
        require(isAToB || tokenIn == address(tokenB), "Invalid token");

        uint256 _reserveA = reserveA;
        uint256 _reserveB = reserveB;

        (IERC20 inToken, IERC20 outToken, uint256 reserveIn, uint256 reserveOut) =
            isAToB
                ? (tokenA, tokenB, _reserveA, _reserveB)
                : (tokenB, tokenA, _reserveB, _reserveA);

        inToken.transferFrom(msg.sender, address(this), amountIn);

        uint256 amountInWithFee =
            (amountIn * FEE_NUMERATOR) / FEE_DENOMINATOR;

        amountOut =
            (reserveOut * amountInWithFee) /
            (reserveIn + amountInWithFee);

        require(amountOut >= minAmountOut, "Slippage exceeded");

        outToken.transfer(msg.sender, amountOut);

        // Critical: sync reserves to actual balances (LP fee accrual)
        reserveA = tokenA.balanceOf(address(this));
        reserveB = tokenB.balanceOf(address(this));

        emit Swap(msg.sender, tokenIn, amountIn, amountOut);
    }

    /* ---------- HELPERS ---------- */

    function _min(uint256 a, uint256 b) private pure returns (uint256) {
        return a < b ? a : b;
    }

    function _sqrt(uint256 y) private pure returns (uint256 z) {
        if (y > 3) {
            z = y;
            uint256 x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }
}