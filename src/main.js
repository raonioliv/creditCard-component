import "./css/index.css"

function setCardType(type) {
  const colors = {
    visa: ["#0034F5", "#FFFFFF"],
    masterCard: ["#F39D1B", "#FC290D"],
    default: ["black", "gray"],
    rocketseat: ["#9640DA", "black"],
  }
  $(".cc-bg svg > g g:nth-child(1) path").attr("fill", colors[type][0])
  $(".cc-bg svg > g g:nth-child(2) path").attr("fill", colors[type][1])
  $(".cc-logo span:nth-child(2) img").attr("src", `cc-${type}.svg`)
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
