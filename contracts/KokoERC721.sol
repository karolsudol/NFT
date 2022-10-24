// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract KokoERC721 is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter public _tokenIds;
    event NFTMinted(uint256 indexed _id);

    constructor() ERC721("KokoERC721", "KOK") {}

    function awardItem(address tokeHolder, string memory tokenURI)
        public
        onlyOwner
        returns (uint256)
    {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(tokeHolder, newItemId);
        _setTokenURI(newItemId, tokenURI);

        emit NFTMinted(newItemId);
        return newItemId;
    }
}
