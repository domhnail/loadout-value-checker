$(function() {
  // let backpackURL = 'https://backpack.tf/api/IGetPriceHistory/v1?appid=440&item=Original&quality=Strange&tradable=Tradable&craftable=Craftable&priceindex=0&key=';
  // const steamURL = 'https://api.steampowered.com/IEconItems_440/GetSchemaItems/v0001/?key=';
  //   fetch('https://backpack.tf/api/')
  //     .then(response => response.json())
  //     .then(json => {
  //     });

  //////////////////////////////////////////////////////////////////
  //  DRAWING BOXES
  const wepCosmCount = 3;
  const allQualities = ['Unique','Vintage','Genuine','Strange',"Collector's"];

  function drawWepCosmBoxes() {
    const weaponParent = $('#weaponsParent');
    const cosmeticParent = $('#cosmeticsParent');

    for (let index = 0; index < wepCosmCount; index++) {
      ////////////////////////////////////////////////////////////////////
      //  WEAPON BOXES
      const newWepBox = $(`<div class="weaponContainer${index}"></div>`);
      const newWepInfo = $(`<p class="weaponPriceInfo" id="wepInfoBox${index}"></p>`);
      const newWepInput = $('<input>').addClass('weaponEntry').attr('type', 'text');
      const newWepQuality = $('<select>').addClass('wepQualEntry').attr('name', 'qualities');
      //quality dropdown
      allQualities.forEach(optionText => {
        const quality = $('<option>').text(optionText).val(optionText);
        newWepQuality.append(quality);
      });
      //submit button
      const wepSubmitBtn = $('<button>').text('submit').addClass('submitBtn');
      wepSubmitBtn.on('click', function() {
        //gathering quality and name
        const inputValue = newWepInput.val();
        const selectedQuality = newWepQuality.val();
        let wepCheck = true;
        //passing to updateBox to display
        updateBox(inputValue, index, selectedQuality, wepCheck);
      });
      //appending
      newWepBox.append(newWepInfo, newWepInput, newWepQuality, wepSubmitBtn);
      weaponParent.append(newWepBox);

      ////////////////////////////////////////////////////////////////////
      //  COSMETIC BOXES
      const newCosmBox = $(`<div class="cosmeticContainer${index}"></div>`);
      const newCosmInfo = $(`<p class="cosmeticPriceInfo" id="cosmInfoBox${index}"></p>`);
      const newCosmInput = $('<input>').addClass('cosmeticEntry').attr('type', 'text');
      const newCosmQuality = $('<select>').addClass('cosmQualEntry').attr('name', 'qualities');
      //quality dropdown
      allQualities.forEach(optionText => {
        const quality = $('<option>').text(optionText).val(optionText);
        newCosmQuality.append(quality);
      });
      //submit button
      const cosmSubmitBtn = $('<button>').text('submit').addClass('submitBtn');
      cosmSubmitBtn.on('click', function() {
        const inputValue = newCosmInput.val();
        const selectedQuality = newCosmQuality.val();
        wepCheck = false;
        updateBox(inputValue, index, selectedQuality, wepCheck);
      });
      //appending
      newCosmBox.append(newCosmInfo, newCosmInput, newCosmQuality, cosmSubmitBtn);
      cosmeticParent.append(newCosmBox);
    }
  }

  drawWepCosmBoxes();

  ///////////////////////////////////////////////////////////////////
  // GETTING API KEYS
  const bpKeyEntry = $('#bpKeyEntry');
  const bpKeyEntryButton = $('#submitBPapiButton');
  let apiKey;

  function updateKeyValue() {
    return bpKeyEntry.value;
  }

  bpKeyEntryButton.on('click', function() {
    apiKey = updateKeyValue();
    console.log(apiKey);
    // updateBox(event);
  });

  ///////////////////////////////////////////////////////////////////
  // GETTING ITEM HISTORY
  function updateBox(inputBoxItem, boxIndex, selectedQuality, wepCheck) {
    let itemName = inputBoxItem;

    let backpackHistoryURL = `https://backpack.tf/api/IGetPriceHistory/v1?appid=440&item=${itemName}&quality=${selectedQuality}&tradable=Tradable&craftable=Craftable&priceindex=0&key=${apiKey}`;
    fetch(`${backpackHistoryURL}`)
    .then(response => response.json()
    .then(function(json) {
      const sortedPricesDesc = json.response.history.sort((a,b) => b.timestamp - a.timestamp);
      const mostRecentHigh = sortedPricesDesc[0];
      const totalPrice = sortedPricesDesc.reduce((acc, price) => acc + price.value, 0);
      const averageHistorical = totalPrice / sortedPricesDesc.length;
      console.log(backpackHistoryURL);
      console.log(json);
      //checking if it's a weapon box or a cosmetic box
      if (wepCheck){
        const infoBox = $(`#wepInfoBox${boxIndex}`);
        if (infoBox) {
          infoBox.html(`Market Price: ${mostRecentHigh.value} ${mostRecentHigh.currency}<br>Highest: ${mostRecentHigh.value_high} ${mostRecentHigh.currency}<br>Historical Average: ${parseInt(averageHistorical)} ${mostRecentHigh.currency}`);
        }
      } else {
        const infoBox = $(`#cosmInfoBox${boxIndex}`)
        if (infoBox) {
          infoBox.html(`Market Price: ${mostRecentHigh.value} ${mostRecentHigh.currency}<br>Highest: ${mostRecentHigh.value_high} ${mostRecentHigh.currency}<br>Historical Average: ${parseInt(averageHistorical)} ${mostRecentHigh.currency}`);
        }
      }
      
    }));
  }
});
