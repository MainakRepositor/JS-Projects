const quoteContainer = document.getElementById('quote-container')
const quoteText = document.getElementById('quote')
const authorText = document.getElementById('author')
const twitterButton = document.getElementById('twitter')
const newQuoteBtn = document.getElementById('new-quote')
const loader = document.getElementById('loader')
const errorMessage = document.getElementById('error-message')

function showLoadingSpinner() {
  loader.hidden = false
  quoteContainer.hidden = true
}

function removeLoadingSpinner() {
  if (!loader.hidden) {
    loader.hidden = true
    quoteContainer.hidden = false
  }
}

let countCallsToAPI = 0;

async function getQuoteFromAPI() {
  showLoadingSpinner()
  const proxyUrl = 'https://guarded-peak-77488.herokuapp.com/'
  // const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
  const apiUrl = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json'
  try {
    const response = await fetch(proxyUrl + apiUrl)
    const data = await response.json()

    // If author is blank, add Unknown
    if (data.quoteAuthor === '') {
      authorText.innerText = 'Unknown'
    } else {
      authorText.innerText = data.quoteAuthor
    }

    // Reduce font size for long quotes
    if (data.quoteText.length > 120) {
      quoteText.classList.add('long-quote')
    } else {
      quoteText.classList.remove('long-quote')
    }
    quoteText.innerText = data.quoteText
    // Stop Loader & Show Quote
    removeLoadingSpinner()

  } catch (error) {
    countCallsToAPI += 1
    if (countCallsToAPI <= 10) {
      getQuoteFromAPI()
      console.log('Woops, no quote!', error)
    } else if (countCallsToAPI > 10) {
      errorMessage.classList.add('visible')
    }
  }
}

// Tweet Quote
function tweetQuote() {
  const quote = quoteText.innerText
  const author = authorText.innerText
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`

  window.open(twitterUrl, '_blank')
}


// Event Listeners
newQuoteBtn.addEventListener('click', getQuoteFromAPI)
twitterButton.addEventListener('click', tweetQuote)

// On Load
getQuoteFromAPI();