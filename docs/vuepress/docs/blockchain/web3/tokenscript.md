token script study

https://www.tokenscript.org/

https://community.tokenscript.org/

https://medium.com/alphawallet/tokenscript/home

## TokenScript
https://github.com/TokenScript/TokenScript/tree
https://github.com/TokenScript/TokenScriptTestContracts/tree/master
https://github.com/TokenScript/TokenScript-Examples/tree/master/tutorial

### example: EntryToken
EntryToken.sol
```
pragma solidity ^0.4.25; //

contract EntryToken

{

    mapping(address => uint256[]) inventory;

    uint256[] public spawnedTokens;

    mapping(bytes32 => bool) signatureChecked;

    address public organiser;

    address public paymaster;

    string public name;

    uint8 public constant decimals = 0; //no decimals as Tokens cannot be split

    bool expired = false;

    string public state;

    string public locality;

    string public street;

    string public building;

    string public symbol;

    bytes4 balHash = bytes4(keccak256('balanceOf(address)'));

    bytes4 tradeHash =
bytes4(keccak256('trade(uint256,uint256[],uint8,bytes32,bytes32)'));

    bytes4 passToHash =
bytes4(keccak256('passTo(uint256,uint256[],uint8,bytes32,bytes32,address)'));

    bytes4 spawnPassToHash =bytes4(keccak256('spawnPassTo(uint256,uint256[],uint8,bytes32,bytes32,address)'
));

 

    event Transfer(address indexed _to, uint256 count);

    event TransferFrom(address indexed _from, address indexed _to, uint256
count);

    event Trade(address indexed seller, uint256[] TokenIndices, uint8 v, bytes32
r, bytes32 s);

    event PassTo(uint256[] TokenIndices, uint8 v, bytes32 r, bytes32 s, address
indexed recipient);

 

    modifier organiserOnly()

    {

        require(msg.sender == organiser);

        _;

    }

 

    modifier payMasterOnly()

    {

        require(msg.sender == paymaster);

        _;

    }

 

    function() payable public { revert(); } //should not send any ether directly

 

    constructor (

        uint256[] Tokens,

        string buildingName,

        string streetName,

        string localityName,

        string stateName,

        string symbolName,

        string contractName) public

    {

        organiser = msg.sender;

        paymaster = msg.sender;

        inventory[msg.sender] = Tokens;

        building = buildingName;

        street = streetName;

        locality = localityName;

        state = stateName;

        symbol = symbolName;

        name = contractName;

    }

 

    function supportsInterface(bytes4 interfaceID) external view returns (bool)

    {

        if(interfaceID == balHash

        || interfaceID == tradeHash

        || interfaceID == passToHash

        || interfaceID == spawnPassToHash) return true;

        return false;

    }

 

    function isExpired(uint256 tokenId) public view returns(bool)

    {

        return expired;

    }

 

    function getStreet(uint256 tokenId) public view returns(string)

    {

        return street;

    }

 

    function getBuildingName(uint256 tokenId) public view returns(string)

    {

        return building;

    }

 

    function getState(uint256 tokenId) public view returns(string)

    {

        return state;

    }

 

    function getLocality(uint256 tokenId) public view returns(string)

    {

        return locality;

    }

 

    function getDecimals() public pure returns(uint)

    {

        return decimals;

    }

 

    function name() public view returns(string)

    {

        return name;

    }

 

    function setExpired(uint256[] tokenIds, bool isExpired) public organiserOnly

    {

        expired = isExpired;

    }

 

    function setStreet(uint256[] tokenIds, string newStreet) public
organiserOnly returns(string)

    {

        street = newStreet;

    }

 

    function setBuilding(uint256[] tokenIds, string newBuildingName) public
organiserOnly returns(string)

    {

        building = newBuildingName;

    }

 

    function setState(uint256[] tokenIds, string newState) public organiserOnly
returns(string)

    {

        state = newState;

    }

 

    function setLocality(uint256[] tokenIds, string newLocality) public organiserOnly returns(string)

    {

        locality = newLocality;

    }

 

    // example: 0, [3, 4], 27, "0x9CAF1C785074F5948310CD1AA44CE2EFDA0AB19C308307610D7BA2C74604AE98", "0x23D8D97AB44A2389043ECB3C1FB29C40EC702282DB6EE1D2B2204F8954E4B451"

    // price is encoded in the server and the msg.value is added to the message digest,

    // if the message digest is thus invalid then either the price or something else in the message is invalid

    function trade(uint256 expiry,

                   uint256[] TokenIndices,

                   uint8 v,

                   bytes32 r,

                   bytes32 s) public payable

    {

        //checks expiry timestamp,

        //if fake timestamp is added then message verification will fail

        require(expiry > block.timestamp || expiry == 0);

 

        bytes32 message = encodeMessage(msg.value, expiry, TokenIndices);

        address seller = ecrecover(message, v, r, s);

       

        require(seller == organiser); //only contract owner can issue magiclinks

 

        for(uint i = 0; i < TokenIndices.length; i++)

        { // transfer each individual Tokens in the ask order

            uint256 index = TokenIndices[i];

            assert(inventory[seller][index] != uint256(0)); // 0 means Token gone.

            inventory[msg.sender].push(inventory[seller][index]);

            // 0 means Token gone.

            delete inventory[seller][index];

        }

        seller.transfer(msg.value);

 

        emit Trade(seller, TokenIndices, v, r, s);

    }

 

    function loadNewTokens(uint256[] Tokens) public organiserOnly

    {

        for(uint i = 0; i < Tokens.length; i++)

        {

            inventory[organiser].push(Tokens[i]);

        }

   }

 

    //for new Tokens to be created and given over

    //this requires a special magic link format with tokenids inside rather than indicies

    function spawnPassTo(uint256 expiry,

                    uint256[] Tokens,

                    uint8 v,

                    bytes32 r,

                    bytes32 s,

                    address recipient) public payable

    {

        require(expiry > block.timestamp || expiry == 0);

        bytes32 message = encodeMessageSpawnable(msg.value, expiry, Tokens);

        address giver = ecrecover(message, v, r, s);

        //only the organiser can authorise this

        require(giver == organiser);

        require(!signatureChecked[s]);

        organiser.transfer(msg.value);

        for(uint i = 0; i < Tokens.length; i++)

        {

            inventory[recipient].push(Tokens[i]);

            //log each spawned Token used for a record

            spawnedTokens.push(Tokens[i]);

        }

        //prevent link being reused with the same signature

        signatureChecked[s] = true;

    }

 

           //check if a spawnable Token that created in a magic link is redeemed

    function spawned(uint256 Token) public view returns (bool)

    {

        for(uint i = 0; i < spawnedTokens.length; i++)

        {

            if(spawnedTokens[i] == Token)

            {

                return true;

            }

        }

        return false;

    }

 

    function passTo(uint256 expiry,

                    uint256[] TokenIndices,

                    uint8 v,

                    bytes32 r,

                    bytes32 s,

                    address recipient) public organiserOnly

    {

        require(expiry > block.timestamp || expiry == 0);

        bytes32 message = encodeMessage(0, expiry, TokenIndices);

        address giver = ecrecover(message, v, r, s);

        for(uint i = 0; i < TokenIndices.length; i++)

        {

            uint256 index = TokenIndices[i];

            //needs to use revert as all changes should be reversed

            //if the user doesnt't hold all the Tokens

            assert(inventory[giver][index] != uint256(0));

            uint256 Token = inventory[giver][index];

            inventory[recipient].push(Token);

            delete inventory[giver][index];

        }

        emit PassTo(TokenIndices, v, r, s, recipient);

    }

 

    // Pack value, expiry, Tokens into 1 array

    function encodeMessage(uint value, uint expiry, uint256[] TokenIndices)

        internal view returns (bytes32)

    {

        bytes memory message = new bytes(84 + TokenIndices.length * 2);

        address contractAddress = getThisContractAddress();

        for (uint i = 0; i < 32; i++)

        {

            message[i] = byte(bytes32(value << (8 * i)));

        }

 

        for (i = 0; i < 32; i++)

        {

            message[i + 32] = byte(bytes32(expiry << (8 * i)));

        }

 

        for(i = 0; i < 20; i++)

        {

            message[64 + i] = byte(bytes20(contractAddress) << (8 * i));

        }

 

        for (i = 0; i < TokenIndices.length; i++)

        {

            message[84 + i * 2 ] = byte(TokenIndices[i] >> 8);

            message[84 + i * 2 + 1] = byte(TokenIndices[i]);

        }

 

        return keccak256(message);

    }

 

    // Pack value, expiry, Tokens into 1 array

    function encodeMessageSpawnable(uint value, uint expiry, uint256[] Tokens)

        internal view returns (bytes32)

    {

        bytes memory message = new bytes(84 + Tokens.length * 32);

        address contractAddress = getThisContractAddress();

        for (uint i = 0; i < 32; i++)

        {

            message[i] = byte(bytes32(value << (8 * i)));

        }

 

        for (i = 0; i < 32; i++)

        {

            message[i + 32] = byte(bytes32(expiry << (8 * i)));

        }

 

        for(i = 0; i < 20; i++)

        {

            message[64 + i] = byte(bytes20(contractAddress) << (8 * i));

        }

 

        for (i = 0; i < Tokens.length; i++)

        {

            for (uint j = 0; j < 32; j++)

            {

                message[84 + i * 32 + j] = byte(bytes32(Tokens[i] << (8 * j)));

            }

        }

        return keccak256(message);

    }

 

    function getSymbol() public view returns(string)

    {

        return symbol;

    }

 

    function balanceOf(address _owner) public view returns (uint256[])

    {

        return inventory[_owner];

    }

 

    function myBalance() public view returns(uint256[])

    {

        return inventory[msg.sender];

    }

 

    function transfer(address _to, uint256[] TokenIndices) organiserOnly public

    {

        for(uint i = 0; i < TokenIndices.length; i++)

        {

            uint index = uint(TokenIndices[i]);

            require(inventory[msg.sender][index] != uint256(0));

            //pushes each element with ordering

            inventory[_to].push(inventory[msg.sender][index]);

            delete inventory[msg.sender][index];

        }

        emit Transfer(_to, TokenIndices.length);

    }

 

    function transferFrom(address _from, address _to, uint256[] TokenIndices)

        organiserOnly public

    {

        for(uint i = 0; i < TokenIndices.length; i++)

        {

            uint index = uint(TokenIndices[i]);

            require(inventory[_from][index] != uint256(0));

            //pushes each element with ordering

            inventory[_to].push(inventory[_from][index]);

            delete inventory[_from][index];

        }

        emit TransferFrom(_from, _to, TokenIndices.length);

    }

 

    function endContract() public organiserOnly

    {

        selfdestruct(organiser);

    }

 

    function isStormBirdContract() public pure returns (bool)

    {

        return true;

    }

 

    function getThisContractAddress() public view returns(address)

    {

        return this;

    }

}
```

EntryToken.xml:
```
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<ts:token xmlns:ethereum="urn:ethereum:constantinople"
          xmlns:ts="http://tokenscript.org/2020/06/tokenscript"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          name="entrytoken"
          xsi:schemaLocation="http://tokenscript.org/2020/06/tokenscript http://tokenscript.org/2020/06/tokenscript.xsd"
>
  <ts:label>
    <ts:plurals xml:lang="en">
      <ts:string quantity="one">Ticket</ts:string>
      <ts:string quantity="other">Tickets</ts:string>
    </ts:plurals>
    <ts:plurals xml:lang="es">
      <ts:string quantity="one">Boleto de admisión</ts:string>
      <ts:string quantity="other">Boleto de admisiónes</ts:string>
    </ts:plurals>
    <ts:plurals xml:lang="zh">
      <ts:string quantity="one">入場券</ts:string>
      <ts:string quantity="other">入場券</ts:string>
    </ts:plurals>
  </ts:label>
  <ts:contract interface="erc875" name="EntryToken">
    <ts:address network="1">0x63cCEF733a093E5Bd773b41C96D3eCE361464942</ts:address>
    <ts:address network="3">0xFB82A5a2922A249f32222316b9D1F5cbD3838678</ts:address>
    <ts:address network="4">0x59a7a9fd49fabd07c0f8566ae4be96fcf20be5e1</ts:address>
    <ts:address network="42">0x2B58A9403396463404c2e397DBF37c5EcCAb43e5</ts:address>
  </ts:contract>
  <ts:origins>
    <!-- Define the contract which holds the token that the user will use -->
    <ts:ethereum contract="EntryToken"></ts:ethereum>
  </ts:origins>
    <ts:selection filter="expired=TRUE" name="expired">
      <ts:label>
        <ts:plurals xml:lang="en">
          <ts:string quantity="one">Expired Ticket</ts:string>
          <ts:string quantity="other">Expired Tickets</ts:string>
        </ts:plurals>
        <ts:string xml:lang="zh">已经过期的票</ts:string>
      </ts:label>
    </ts:selection>
  <ts:cards>
    <ts:card name="main" type="token">
      <ts:item-view xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
        <style type="text/css">.ts-count {
  font-family: "SourceSansPro";
  font-weight: bolder;
  font-size: 21px;
  color: rgb(117, 185, 67);
}
.ts-category {
  font-family: "SourceSansPro";
  font-weight: lighter;
  font-size: 21px;
  color: rgb(67, 67, 67);
}
.ts-venue {
  font-family: "SourceSansPro";
  font-weight: lighter;
  font-size: 16px;
  color: rgb(67, 67, 67);
}
.ts-date {
  font-family: "SourceSansPro";
  font-weight: bold;
  font-size: 14px;
  color: rgb(112, 112, 112);
  margin-left: 7px;
  margin-right: 7px;
}
.ts-time {
  font-family: "SourceSansPro";
  font-weight: lighter;
  font-size: 16px;
  color: rgb(112, 112, 112);
}
html {
}

body {
padding: 0px;
margin: 0px;
}

div {
margin: 0px;
padding: 0px;
}

.data-icon {
height:16px;
vertical-align: middle
}

.tbml-count {  font-family: "SourceSansPro";  font-weight: bolder;  font-size: 21px;  color: rgb(117, 185, 67);}.tbml-category {  font-family: "SourceSansPro";  font-weight: lighter;  font-size: 21px;  color: rgb(67, 67, 67);}.tbml-venue {  font-family: "SourceSansPro";  font-weight: lighter;  font-size: 16px;  color: rgb(67, 67, 67);}.tbml-date {  font-family: "SourceSansPro";  font-weight: bold;  font-size: 14px;  color: rgb(112, 112, 112);  margin-left: 7px;  margin-right: 7px;}.tbml-time {  font-family: "SourceSansPro";  font-weight: lighter;  font-size: 16px;  color: rgb(112, 112, 112);}   html {   }      body {   padding: 0px;   margin: 0px;   }      div {   margin: 0px;   padding: 0px;   }   .data-icon {   height:16px;   vertical-align: middle   }


</style>
        <body><div>
    <!-- Iconified view displayed on the first page when clicking on token card in AlphaWallet -->
    <p>Enter Satoshi's villa with this special token!
        <img alt="" src="data:image/jpeg;base64,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"></img>
    </p>
</div>
</body>
      </ts:item-view>
      <ts:view xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
        <style type="text/css">.ts-count {
  font-family: "SourceSansPro";
  font-weight: bolder;
  font-size: 21px;
  color: rgb(117, 185, 67);
}
.ts-category {
  font-family: "SourceSansPro";
  font-weight: lighter;
  font-size: 21px;
  color: rgb(67, 67, 67);
}
.ts-venue {
  font-family: "SourceSansPro";
  font-weight: lighter;
  font-size: 16px;
  color: rgb(67, 67, 67);
}
.ts-date {
  font-family: "SourceSansPro";
  font-weight: bold;
  font-size: 14px;
  color: rgb(112, 112, 112);
  margin-left: 7px;
  margin-right: 7px;
}
.ts-time {
  font-family: "SourceSansPro";
  font-weight: lighter;
  font-size: 16px;
  color: rgb(112, 112, 112);
}
html {
}

body {
padding: 0px;
margin: 0px;
}

div {
margin: 0px;
padding: 0px;
}

.data-icon {
height:16px;
vertical-align: middle
}

.tbml-count {  font-family: "SourceSansPro";  font-weight: bolder;  font-size: 21px;  color: rgb(117, 185, 67);}.tbml-category {  font-family: "SourceSansPro";  font-weight: lighter;  font-size: 21px;  color: rgb(67, 67, 67);}.tbml-venue {  font-family: "SourceSansPro";  font-weight: lighter;  font-size: 16px;  color: rgb(67, 67, 67);}.tbml-date {  font-family: "SourceSansPro";  font-weight: bold;  font-size: 14px;  color: rgb(112, 112, 112);  margin-left: 7px;  margin-right: 7px;}.tbml-time {  font-family: "SourceSansPro";  font-weight: lighter;  font-size: 16px;  color: rgb(112, 112, 112);}   html {   }      body {   padding: 0px;   margin: 0px;   }      div {   margin: 0px;   padding: 0px;   }   .data-icon {   height:16px;   vertical-align: middle   }


</style>
        <script type="text/javascript">//
    (function() {
        'use strict'
        function GeneralizedTime(generalizedTime) {
            this.rawData = generalizedTime;
        }

        GeneralizedTime.prototype.getYear = function () {
            return parseInt(this.rawData.substring(0, 4), 10);
        };

        GeneralizedTime.prototype.getMonth = function () {
            return parseInt(this.rawData.substring(4, 6), 10) - 1;
        };

        GeneralizedTime.prototype.getDay = function () {
            return parseInt(this.rawData.substring(6, 8), 10)
        };

        GeneralizedTime.prototype.getHours = function () {
            return parseInt(this.rawData.substring(8, 10), 10)
        };

        GeneralizedTime.prototype.getMinutes = function () {
            var minutes = parseInt(this.rawData.substring(10, 12), 10)
            if (minutes) return minutes
            return 0
        };

        GeneralizedTime.prototype.getSeconds = function () {
            var seconds = parseInt(this.rawData.substring(12, 14), 10)
            if (seconds) return seconds
            return 0
        };

        GeneralizedTime.prototype.getMilliseconds = function () {
            var startIdx
            if (time.indexOf('.') !== -1) {
                startIdx = this.rawData.indexOf('.') + 1
            } else if (time.indexOf(',') !== -1) {
                startIdx = this.rawData.indexOf(',') + 1
            } else {
                return 0
            }

            var stopIdx = time.length - 1
            var fraction = '0' + '.' + time.substring(startIdx, stopIdx)
            var ms = parseFloat(fraction) * 1000
            return ms
        };

        GeneralizedTime.prototype.getTimeZone = function () {
            let time = this.rawData;
            var length = time.length
            var symbolIdx
            if (time.charAt(length - 1 ) === 'Z'){
                return 0
            }
            if (time.indexOf('+') !== -1) {
                symbolIdx = time.indexOf('+')
            } else if (time.indexOf('-') !== -1) {
                symbolIdx = time.indexOf('-')
            } else {
                return NaN
            }
            var minutes = time.substring(symbolIdx + 2)
            var hours = time.substring(symbolIdx + 1, symbolIdx + 2)
            var one = (time.charAt(symbolIdx) === '+') ? 1 : -1
            var intHr = one * parseInt(hours, 10) * 60 * 60 * 1000
            var intMin = one * parseInt(minutes, 10) * 60 * 1000
            var ms = minutes ? intHr + intMin : intHr
            return ms
        };

        if (typeof exports === 'object') {
            module.exports = GeneralizedTime
        } else if (typeof define === 'function') {
            define(GeneralizedTime)
        } else {
            window.GeneralizedTime = GeneralizedTime
        }
    }())

class Token {
    constructor(tokenInstance) {
        this.props = tokenInstance;
    }

    formatGeneralizedTimeToDate(str) {
        const d = new GeneralizedTime(str);
        return new Date(d.getYear(), d.getMonth(), d.getDay(), d.getHours(), d.getMinutes(), d.getSeconds()).toLocaleDateString();
    }

    formatGeneralizedTimeToTime(str) {
        const d = new GeneralizedTime(str);
        return new Date(d.getYear(), d.getMonth(), d.getDay(), d.getHours(), d.getMinutes(), d.getSeconds()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }

    render() {
        let time;
        let date;
        if (this.props.time == null) {
            time = "";
            date = "";
        } else {
            time = this.formatGeneralizedTimeToTime(this.props.time.generalizedTime);
            date = this.props.time == null ? "": this.formatGeneralizedTimeToDate(this.props.time.generalizedTime);
        }
        return `&lt;div&gt;
            &lt;div&gt;
                &lt;span class="ts-count"&gt;x${this.props._count}&lt;/span&gt;  &lt;span class="ts-category"&gt;${this.props.label}&lt;/span&gt;
            &lt;/div&gt;
            &lt;div&gt;
                &lt;span class="ts-venue"&gt;${this.props.building}&lt;/span&gt;
            &lt;/div&gt;
                &lt;div style="margin: 0px; padding:0px; clear: both; height: 6px"&gt;
                &amp;nbsp;
                &lt;/div&gt;
            &lt;div&gt;
                &lt;img src="data:image/png;base64,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" class="data-icon"/&gt;
                &lt;span class="ts-date"&gt;${date}&lt;/span&gt;
            &lt;/div&gt;
            &lt;div&gt;
                &lt;span class="ts-time"&gt;${time}, ${this.props.locality}&lt;/span&gt;
            &lt;/div&gt;
            &lt;/div&gt;`;
    }
}

web3.tokens.dataChanged = (oldTokens, updatedTokens, tokenCardId) =&gt; {
    const currentTokenInstance = updatedTokens.currentInstance;
    document.getElementById(tokenCardId).innerHTML = new Token(currentTokenInstance).render();
};

//
</script>
      </ts:view>
    </ts:card>
    <ts:card exclude="expired" name="enter" type="action">
      <!-- this action is of the model confirm-back.
      It should be <ts:card type="action" model="confirm-back"> but Weiwu
      shied away from specifying that due to the likely change of design causing an upgrade path issue.
      window.onConfirm is called if user hit "confirm";
      window.close() causes the back button to be pressed.
      -->
      <ts:label>
        <ts:string xml:lang="en">Enter</ts:string>
        <ts:string xml:lang="zh">入場</ts:string>
        <ts:string xml:lang="es">Entrar</ts:string>
      </ts:label>
      <ts:view xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
        <style type="text/css">.ts-count {
  font-family: "SourceSansPro";
  font-weight: bolder;
  font-size: 21px;
  color: rgb(117, 185, 67);
}
.ts-category {
  font-family: "SourceSansPro";
  font-weight: lighter;
  font-size: 21px;
  color: rgb(67, 67, 67);
}
.ts-venue {
  font-family: "SourceSansPro";
  font-weight: lighter;
  font-size: 16px;
  color: rgb(67, 67, 67);
}
.ts-date {
  font-family: "SourceSansPro";
  font-weight: bold;
  font-size: 14px;
  color: rgb(112, 112, 112);
  margin-left: 7px;
  margin-right: 7px;
}
.ts-time {
  font-family: "SourceSansPro";
  font-weight: lighter;
  font-size: 16px;
  color: rgb(112, 112, 112);
}
html {
}

body {
padding: 0px;
margin: 0px;
}

div {
margin: 0px;
padding: 0px;
}

.data-icon {
height:16px;
vertical-align: middle
}

.tbml-count {  font-family: "SourceSansPro";  font-weight: bolder;  font-size: 21px;  color: rgb(117, 185, 67);}.tbml-category {  font-family: "SourceSansPro";  font-weight: lighter;  font-size: 21px;  color: rgb(67, 67, 67);}.tbml-venue {  font-family: "SourceSansPro";  font-weight: lighter;  font-size: 16px;  color: rgb(67, 67, 67);}.tbml-date {  font-family: "SourceSansPro";  font-weight: bold;  font-size: 14px;  color: rgb(112, 112, 112);  margin-left: 7px;  margin-right: 7px;}.tbml-time {  font-family: "SourceSansPro";  font-weight: lighter;  font-size: 16px;  color: rgb(112, 112, 112);}   html {   }      body {   padding: 0px;   margin: 0px;   }      div {   margin: 0px;   padding: 0px;   }   .data-icon {   height:16px;   vertical-align: middle   }


</style>
        <script type="text/javascript">//
class Token {
    constructor(tokenInstance) {
        this.props = tokenInstance
        document.getElementById("contractAddress").value = this.props.EntryToken;
    }
}

web3.tokens.dataChanged = (oldTokens, updatedTokens, tokenCardId) =&gt; {
    const currentTokenInstance = updatedTokens.currentInstance;
    document.getElementById(tokenCardId).innerHTML = new Token(currentTokenInstance).render();
};

document.addEventListener("DOMContentLoaded", function() {
    window.onload = function startup() {
        // 1. call API to fetch challenge
        fetch('http://stormbird.duckdns.org:8080/api/getChallenge')
            .then(function (response) {
                return response.text()
            })
            .then(function (response) {
                document.getElementById('msg').innerHTML = 'Challenge: ' + response
                window.challenge = response
            })
    }

    window.onConfirm = function onConfirm(signature) {
        if (window.challenge === undefined || window.challenge.length == 0) return
        const challenge = window.challenge
        document.getElementById('status').innerHTML = 'Wait for signature...'
        // 2. sign challenge to generate response
        web3.personal.sign({ data: challenge }, function (error, value) {
            if (error != null) {
                document.getElementById('status').innerHTML = error
                window.onload();
                return
            }

            document.getElementById('status').innerHTML = 'Verifying credentials ...'
            // 3. open door
            let contractAddress = document.getElementById("contractAddress").textContent;
            fetch(`http://stormbird.duckdns.org:8080/api/checkSignature?contract=${contractAddress}&amp;challenge=${challenge}&amp;sig=${value}`)
                .then(function (response) {
                    return response.text()
                })
                .then(function (response) {
                    if (response == "pass") {
                        document.getElementById('status').innerHTML = 'Entrance granted!'
                        window.close()
                    } else {
                        document.getElementById('status').innerHTML = 'Failed with: ' + response
                    }
                })
        });
        window.challenge = '';
        document.getElementById('msg').innerHTML = '';
    }
});
//
</script>
        <body><h3>Welcome to Craig Wright's house!</h3>
<div id="msg">Preparing to unlock the entrance door.</div>
<div id="contractAddress"></div>
<div id="status"></div>
</body>
      </ts:view>
    </ts:card>
  </ts:cards>
    <ts:attribute name="tokenId" distinct="true">
      <ts:type>
        <ts:syntax>1.3.6.1.4.1.1466.115.121.1.40</ts:syntax>
      </ts:type>
      <ts:origins>
        <ethereum:call function="balanceOf" contract="EntryToken">
            <ts:data>
              <ts:uint256 ref="ownerAddress"></ts:uint256>
            </ts:data>
        </ethereum:call>
      </ts:origins>
    </ts:attribute>
    <ts:attribute name="locality">
        <ts:type><ts:syntax>1.3.6.1.4.1.1466.115.121.1.15</ts:syntax></ts:type>
      <ts:origins>
        <ethereum:call as="utf8" contract="EntryToken" function="getLocality">
            <ts:data>
              <ts:uint256 ref="tokenId"></ts:uint256>
            </ts:data>
        </ethereum:call>
      </ts:origins>

    </ts:attribute>
    <ts:attribute name="time">
        <ts:type><ts:syntax>1.3.6.1.4.1.1466.115.121.1.24</ts:syntax></ts:type>
      <ts:label>
        <ts:string xml:lang="en">Time</ts:string>
        <ts:string xml:lang="zh">时间</ts:string>
      </ts:label>
      <ts:origins>
        <ts:token-id as="utf8" bitmask="
        0000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF0000000000000000000000
        474d542b33000000000000000000000001075b2282f05255534b534101050002
"></ts:token-id>
      </ts:origins>
    </ts:attribute>
    <ts:attribute name="expired"> <!-- boolean -->
        <ts:type><ts:syntax>1.3.6.1.4.1.1466.115.121.1.7</ts:syntax></ts:type>
      <ts:origins>
        <ethereum:call as="bool" contract="EntryToken" function="isExpired">
          <ts:data>
            <ts:uint256 ref="tokenId"></ts:uint256>
          </ts:data>
        </ethereum:call>
      </ts:origins>
    </ts:attribute>
    <ts:attribute name="street"> <!-- string -->
        <ts:type><ts:syntax>1.3.6.1.4.1.1466.115.121.1.15</ts:syntax></ts:type>
      <ts:origins>
        <ethereum:call as="utf8" contract="EntryToken" function="getStreet">
          <ts:data>
            <ts:uint256 ref="tokenId"></ts:uint256>
          </ts:data>
        </ethereum:call>
      </ts:origins>
    </ts:attribute>
    <ts:attribute name="building"> <!-- string -->
        <ts:type><ts:syntax>1.3.6.1.4.1.1466.115.121.1.15</ts:syntax></ts:type>
      <ts:origins>
        <ethereum:call as="utf8" contract="EntryToken" function="getBuildingName">
          <ts:data>
            <ts:uint256 ref="tokenId"></ts:uint256>
          </ts:data>
        </ethereum:call>
      </ts:origins>
    </ts:attribute>
    <ts:attribute name="state"> <!-- string -->
        <ts:type><ts:syntax>1.3.6.1.4.1.1466.115.121.1.15</ts:syntax></ts:type>
      <ts:origins>
        <ethereum:call as="utf8" contract="EntryToken" function="getState">
          <ts:data>
            <ts:uint256 ref="tokenId"></ts:uint256>
          </ts:data>
        </ethereum:call>
      </ts:origins>
    </ts:attribute>
</ts:token>
```

OnConfirm:
```
@objc func proceed() {
        let javaScriptToCallConfirm = """
                                      if (window.onConfirm != null) {
                                        onConfirm()
                                      }
                                      """
        tokenScriptRendererView.inject(javaScript: javaScriptToCallConfirm)
        let userEntryIds = action.attributes.values.compactMap { $0.userEntryId }
        let fetchUserEntries = userEntryIds
            .map { "document.getElementById(\"\($0)\").value" }
            .compactMap { tokenScriptRendererView.inject(javaScript: $0) }
        guard let navigationController = navigationController else { return }

        TokenScript.performTokenScriptAction(action, token: token, tokenId: tokenId, tokenHolder: tokenHolder, userEntryIds: userEntryIds, fetchUserEntries: fetchUserEntries, localRefsSource: tokenScriptRendererView, assetDefinitionStore: assetDefinitionStore, keystore: keystore, server: server, session: session, confirmTokenScriptActionTransactionDelegate: self, navigationController: navigationController)
    }
```
https://github.com/AlphaWallet/alpha-wallet-ios/blob/07c8ad7f6770df647525504b7d955e0f85a56b55/AlphaWallet/Tokens/ViewControllers/TokenInstanceActionViewController.swift#L154

## EIP5169 powered Token with script and firmware code
https://github.com/TokenScript/EIP5169TokenFactory/
## Web3E
