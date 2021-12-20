// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.12;
import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract EphereFootballerERC721 is
    Context,
    AccessControlEnumerable,
    ERC721Enumerable,
    ERC721Burnable,
    ERC721Pausable
{
    using Counters for Counters.Counter;

    string private constant BASE_TOKEN_URI = "https://ipfs.ephere.io/ipfs/";

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    uint256 public immutable _maxSupply;

    mapping(uint256 => string) _cid;
    Counters.Counter private _tokenIdTracker;

    constructor(uint256 maxSupply) ERC721("Ephere Football Player", "EFP") {
        _maxSupply = maxSupply;
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(MINTER_ROLE, _msgSender());
        _setupRole(PAUSER_ROLE, _msgSender());
    }

    // Comentar
    function getCid(uint256 _id) public view returns (string memory) {
        return _cid[_id];
    }

    //Comentar
    function getCounter() public view returns (uint256) {
        uint256 tokenId = _tokenIdTracker.current();
        return tokenId;
    }

    /**
     * @notice sets minter role for an addresss
     * @param user The address of the user we want to set as minter
     */
    function setMinter(address user) public{
         _setupRole(MINTER_ROLE, user);
    }
    
    function checkMinter(address user) public  view returns(bool){
        return hasRole(MINTER_ROLE, user);
    }
    /**
     * @notice gets ERC721 tokenIds from an address who owns them
     * @dev Creates a new array where its size is equal to the result of balanceOf() (gets the number of erc721 of the address). Goes through all erc721 and checks if the owner of
     * that token is the same as the parameter owner. If so, it adds the tokenid (i) to the result array.
     * @param owner The address of the user we want to get the token list from
     */
    function getTokenIdsFromAddress(address owner)
        public
        view
        returns (uint256[] memory)
    {
        //uint256 lastId = _tokenIdTracker.current();
        //require(lastId > 0, "There is no Ephere ERC 721 minted");
        uint256 erc721Cuantity = balanceOf(owner);
        uint256[] memory result = new uint256[](erc721Cuantity);
        for (uint256 i = 0; i < erc721Cuantity ; i++) {
           result[i] = tokenOfOwnerByIndex(owner, i );
        }
        return result;
    }

    function mint(string memory cid, address to) public virtual {
        require(
            hasRole(MINTER_ROLE, _msgSender()),
            "EphereFootballerERC721: must have minter role to mint"
        );
        require(
            totalSupply() < _maxSupply,
            "EphereFootballerERC721: cannot exceed max total supply"
        );

        // We cannot just use balanceOf to create the new tokenId because tokens
        // can be burned (destroyed), so we need a separate counter.
        _tokenIdTracker.increment();
        uint256 tokenId = _tokenIdTracker.current();
        _mint(to, tokenId);
        _cid[tokenId] = cid;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "EphereFootballerERC721: URI query for nonexistent token"
        );

        return string(abi.encodePacked(BASE_TOKEN_URI, _cid[tokenId]));
    }

    function pause() public virtual {
        require(
            hasRole(PAUSER_ROLE, _msgSender()),
            "EphereFootballerERC721: must have pauser role to pause"
        );
        _pause();
    }

    function unpause() public virtual {
        require(
            hasRole(PAUSER_ROLE, _msgSender()),
            "EphereFootballerERC721: must have pauser role to unpause"
        );
        _unpause();
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721, ERC721Enumerable, ERC721Pausable) {
        super._beforeTokenTransfer(from, to, tokenId);

        if (to == address(0)) {
            delete _cid[tokenId];
        }
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(AccessControlEnumerable, ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
