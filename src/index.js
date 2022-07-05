import 'regenerator-runtime/runtime'
import { initContract, login, logout } from './utils'
import { utils } from "near-api-js";
import image1 from './assets/1.png';
import image2 from './assets/2.png';
import image3 from './assets/3.png';
import image4 from './assets/4.png';
import image5 from './assets/5.png';
import image6 from './assets/6.png';

const images = [image1, image2, image3, image4, image5, image6]
const BN = require("bn.js");

function showNotification() {
  document.querySelector('[data-behavior=notification]').style.display = 'block'
  document.getElementById('signed-in-flow').style.pointerEvents = 'none'
  setTimeout(() => {
    document.querySelector('[data-behavior=notification]').style.display = 'none'
    window.location.search = ''
  }, 7000)
}


window.onload = async () => {

  console.log(window.location.href);
  console.log(window.location.search);


  if (window.location.search) {
    let a = window.location.search.split(/[?&=]+/);
    if (a[1] === 'transactionHashes') {
      await showNotification();
    } else {
      alert("Transaction Failed!")
      window.location.search = ''
    }

  }

  const prices = [99, 84, 77, 71, 65, 61];

  const medias = [
    "https://link.storjshare.io/jxutk2refbbz5ffxbj55ekcf4tka/showcode-hackathon%2F1.png?wrap=0",
    "https://link.storjshare.io/jwxlflsc4xx3bmffgrg7j34h6mnq/showcode-hackathon%2F2.png?wrap=0",
    "https://link.storjshare.io/jxsaus3qtpck6aqgx2gdutv45zga/showcode-hackathon%2F3.png?wrap=0",
    "https://link.storjshare.io/jus34ztbnzwfpuqefzrvlekx2a7q/showcode-hackathon%2F4.png?wrap=0",
    "https://link.storjshare.io/jxpp22a2i3l7wid62ko5b53grafq/showcode-hackathon%2F5.png?wrap=0",
    "https://link.storjshare.io/jx5asdfe6eld64gvqj6w4c7yrwga/showcode-hackathon%2F6.png?wrap=0"
  ]

  let containers = document.getElementsByClassName('items-container');

  for (let i = 0; i < prices.length; i++) {
    let container = containers[i <= 2 ? 0 : 1];
    let div = document.createElement('div');
    div.style = "margin-bottom:30px; margin-left: auto; margin-right: auto; border: 2.5px solid #ff585d; padding-bottom: 25px;";
    div.innerHTML = `<img id="image` + (i + 1).toString() + `" style = "margin-top: 30px; width: 100%"/>
    <div>
      <p style="font-weight: 500;">
        Sneaker #`+ (i + 1).toString() + `
      </p>
      <form id="form`+ (i + 1).toString() + `">
        <p>
          Price: `+ prices[i] + `
          <span title="NEAR Tokens">Ⓝ</span>
        </p>
        <input id="b`+ (i + 1).toString() + `" style="background-color: #0072ce; color: #efefef; margin-top: 5px;" type="submit" value="Buy">
      </form>
    </div>`
      ;

    container.appendChild(div);

    const image = document.getElementById('image' + (i + 1).toString());
    image.src = images[i]

    const form = document.
      getElementById('form' + (i + 1).toString());

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      let amt = prices[i];
      amt = utils.format.parseNearAmount(amt.toString()).toString()
      try {
        await window.contract.nft_mint({
          token_id: window.accountId + '#' + (i + 1).toString(),
          metadata: {
            title: "Sneaker #" + (i + 1).toString(),
            description: "This NFT is a part of Showcode Hackathon ;)",
            media: medias[i],
          },
          receiver_id: window.accountId,
        },
          300000000000000,
          new BN(amt))
      } catch (e) {
        alert(
          'Something went wrong! ' +
          'Maybe you need to sign out and back in? ' +
          'Check your browser console for more info.'
        )
        throw e
      }
    })
  }

  let mintedNFTS = await window.contract.nft_tokens_for_owner({ account_id: window.accountId.toString() });
  if (mintedNFTS.length != 0) {
    mintedNFTS.sort((a, b) => a.token_id < b.token_id ? -1 : 1)
    for (let i = 0; i < mintedNFTS.length; i++) {
      let title = mintedNFTS[i].metadata.title
      let tokenId = title.charAt(title.length - 1)
      let container = containers[i <= 2 ? 2 : 3];
      let div = document.createElement('div');
      div.style = "margin-bottom:30px; margin-left: auto; margin-right: auto; border: 2.5px solid #ff585d; padding-bottom: 25px;";
      div.innerHTML = `<img id="imagec` + tokenId + `" style = "margin-top: 30px; width: 100%"/>
    <div>
      <p style="font-weight: 500;">
        Sneaker #`+ tokenId + `
      </p>
    </div>`
        ;
      container.appendChild(div);
      const image = document.getElementById('imagec' + tokenId);
      image.src = images[parseInt(tokenId) - 1]
      let formButton = document.getElementById('b' + tokenId)
      formButton.disabled = true
      formButton.value = "Minted"


    }
  }
}

document.querySelector('#sign-in-button').onclick = login
document.querySelector('#sign-out-button').onclick = logout

// Display the signed-out-flow container
function signedOutFlow() {
  document.querySelector('#signed-out-flow').style.display = 'block'
}

// Displaying the signed in flow container and fill in account-specific data
function signedInFlow() {
  document.querySelector('#signed-in-flow').style.display = 'block'

  document.querySelectorAll('[data-behavior=account-id]').forEach(el => {
    el.innerText = window.accountId
  })
}

// `nearInitPromise` gets called on page load
window.nearInitPromise = initContract()
  .then(() => {
    if (window.walletConnection.isSignedIn()) signedInFlow()
    else signedOutFlow()
  })
  .catch(console.error)
