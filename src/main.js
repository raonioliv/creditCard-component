import "./css/index.css"
import IMask from "imask"
const ccBgColor1 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor2 = document.querySelector(".cc-bg svg > g g:nth-child(2) path ")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  const colors = {
    visa: ["#0034F5", "#FFFFFF"],
    masterCard: ["#F39D1B", "#FC290D"],
    default: ["black", "gray"],
    rocketseat: ["#9640DA", "black"],
  }

  //jQuery solution
  // $(".cc-bg svg > g g:nth-child(1) path").attr("fill", colors[type][0])
  // $(".cc-bg svg > g g:nth-child(2) path").attr("fill", colors[type][1])
  // $(".cc-logo span:nth-child(2) img").attr("src", `cc-${type}.svg`)

  ccBgColor1.setAttribute("fill", colors[type][0])
  ccBgColor2.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}
setCardType("masterCard")
globalThis.setCardType = setCardType

$("#card-number").on("input", function (e) {
  var firstDigit = this.value.charAt(0)
  const flags = {
    4: "visa",
    5: "masterCard",
    6: "rocketseat",
  }

  setCardType(flags[firstDigit])
})

const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "0000",
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 20).slice(2),
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "visa",
      regex: /^4\d{0,15}/,
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "masterCard",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "rocketseat",
      regex: /(^6[1-5]\d{0,2})\d{0,12}/,
    },
  ],

  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find((item) => {
      return item.regex ? number.match(item.regex) : false
    })
    return foundMask || dynamicMasked.compiledMasks[0]
  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)
globalThis.cardNumberPattern = cardNumberPattern

//form events

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", (e) => {
  e.preventDefault()
})

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", (e) => {
  const ccHolder = document.querySelector(".cc-holder .value")
  ccHolder.innerHTML = !cardHolder.value.length
    ? "FULANO DA SILVA"
    : cardHolder.value
})

securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
})

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)
  updateCardNumber(cardNumberMasked.value)
})

expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value)
})

function updateSecurityCode(code) {
  const $ccSecurityCode = document.querySelector(".cc-security .value")
  $ccSecurityCode.innerHTML = !code ? "123" : code
}

function updateExpirationDate(date) {
  const ccExpirationDate = document.querySelector(".cc-expiration .value")
  ccExpirationDate.innerHTML = date.length === 0 ? "02/32" : date
}

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")

  ccNumber.innerHTML = !number.length ? "1234 5678 9012 3456" : number
}
