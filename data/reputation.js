window.asiReputation = {
  rating: "5,0",
  totalReviews: 129,
  fiveStarReviews: 129,
  hasVerifiedFiveStarVolume: true,
  openingHours: "6h \u00e0s 22h, todos os dias",
  googleProfileUrl: "https://share.google/MCQiNjmbHnPvi8Kwo",
  heroHeadline() {
    return `Mudan\u00e7a para <em class="num-hero">todo o Brasil.</em> <em class="num-hero">Sem surpresa.</em>`;
  },
  badge() {
    return `\u2605 ${this.rating} no Google \u00b7 ${this.totalReviews} avalia\u00e7\u00f5es \u00b7 Atendo ${this.openingHours}`;
  },
  perfectBadge() {
    return "";
  }
};
