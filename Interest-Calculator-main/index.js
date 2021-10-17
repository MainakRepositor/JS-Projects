const app = new Vue({
  el: '#interest',
  data: {
    errors: [],
    principle: null,
    rate: null,
    compounds: 12,
    options: [
      { text: "Yearly", value: "1" },
      { text: "Quarterly", value: "4" },
      { text: "Monthly", value: "12" },
      { text: "Bi-Weekly", value: "26" },
      { text: "Weekly", value: "52" },
      { text: "Daily", value: "365" }
    ],
    time: null,
    monthly: false,
    additional: null
  },
  computed: {
    calc: function(principle, rate, compounds, time, monthly, additional) {
      if (!this.monthly) {
        var interest = this.compound(this.principle, this.rate, this.compounds, this.time);
      }
      else {
        if (this.additional) {
          var interest = this.compoundContribute(this.principle, this.rate, this.compounds, this.time, this.additional);
        } else {
          var interest = this.compound(this.principle, this.rate, this.compounds, this.time);
        }
      }
      return interest.toFixed(2);
    }
  },
  methods: {
    checkForm: function(e) {
      if (!this.principle) {
        this.errors.push("Principle required");
      }

      if (!this.rate) {
        this.errors.push("Rate required");
      }

      if (!this.compounds) {
        this.compounds = 12;
      }

      if (!this.time){
        this.errors.push("Time required");
      }

      if (this.monthly && !this.additional){
        this.additional = 0;
      }

      if (!this.errors.length){
        return true;
      }

      e.preventDefault();
    },
    compound: function(principle, rate, compounds, time) {
      var x = 1 + Number(this.rate/100) / Number(this.compounds);
      var y = Number(this.time) * Number(this.compounds);
      var z = Math.pow(x, y);
      return Number(this.principle) * z;
    },
    compoundContribute: function(principle, rate, compounds, time, additional) {
      var principleInterest = this.compound(this.principle, this.rate, this.compounds, this.time);
      var w = Number(this.rate/100) / Number(this.compounds);
      var x = 1 + w;
      var y = Math.pow(x, Number(this.compounds) * Number(this.time));
      var z = (y - 1)/(w);
      var f = Number(this.additional) * z * x;
      return principleInterest + f;
    }
  }
})
