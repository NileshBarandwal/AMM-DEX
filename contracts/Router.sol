// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Pool.sol";

contract Router {

    function addLiquidity(
        address pool,
        uint256 amountA,
        uint256 amountB
    ) external {
        Pool p = Pool(pool);

        address tokenA = address(p.tokenA());
        address tokenB = address(p.tokenB());

        IERC20(tokenA).transferFrom(msg.sender, address(this), amountA);
        IERC20(tokenB).transferFrom(msg.sender, address(this), amountB);

        IERC20(tokenA).approve(pool, amountA);
        IERC20(tokenB).approve(pool, amountB);

        p.addLiquidity(amountA, amountB);
    }

    function swapExactTokensForTokens(
        address pool,
        address tokenIn,
        uint256 amountIn,
        uint256 minAmountOut,
        uint256 deadline
    ) external {
        Pool p = Pool(pool);

        address tokenOut =
            tokenIn == address(p.tokenA())
                ? address(p.tokenB())
                : address(p.tokenA());

        // Pull input tokens from user
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);

        // Approve pool to spend input tokens
        IERC20(tokenIn).approve(pool, amountIn);

        // Track output balance before swap
        uint256 balanceBefore =
            IERC20(tokenOut).balanceOf(address(this));

        // Perform swap (Router receives output tokens)
        p.swap(tokenIn, amountIn, minAmountOut, deadline);

        // Calculate actual output
        uint256 balanceAfter =
            IERC20(tokenOut).balanceOf(address(this));

        uint256 amountOut = balanceAfter - balanceBefore;

        // Forward output tokens to user
        IERC20(tokenOut).transfer(msg.sender, amountOut);
    }
}