// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract KokoERC721collection is ERC721Enumerable, Ownable {
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    Counters.Counter private _tokenCounter;

    uint256 public constant SUPPLY = 10;
    uint256 public constant PRICE = 0.01 ether;
    uint256 public constant MAX_NO_PERMINT = 2;

    string public baseTokenURI;

    constructor(string memory baseURI) ERC721("Koko Kollection", "KOKOL") {
        setBaseURI(baseURI);
    }

    function setBaseURI(string memory _baseTokenURI) public {
        baseTokenURI = _baseTokenURI;
    }

    function mintNFTs(uint _count) public payable {
        uint totalMinted = _tokenCounter.current();

        require(totalMinted.add(_count) <= SUPPLY, "insufficient supply");
        require(
            _count > 0 && _count <= MAX_NO_PERMINT,
            "mint number only 1 or 2"
        );
        require(msg.value >= PRICE.mul(_count), "insufficient balance");

        for (uint i = 0; i < _count; i++) {
            _mintNFT();
        }
    }

    function _mintNFT() private {
        uint256 newID = _tokenCounter.current();
        _safeMint(msg.sender, newID);
        _tokenCounter.increment();
    }

    function ownedTokens(address _owner) external view returns (uint[] memory) {
        uint itemsCount = balanceOf(_owner);
        uint[] memory items = new uint256[](itemsCount);

        for (uint i = 0; i < itemsCount; i++) {
            items[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return items;
    }

    function withdraw() public payable onlyOwner {
        uint balance = address(this).balance;
        require(balance > 0, "insufficient balance");

        (bool success, ) = (msg.sender).call{value: balance}("");
        require(success, "transfer failed");
    }
}
