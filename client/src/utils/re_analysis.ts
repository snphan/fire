
interface REAsset {
  id: number;
  address: string;
  purchase_price: number;
  bedrooms: number;
  bathrooms: number;
  picture_links: string[];
  city: string;
  province: string;
  re_assumptions: REAssumptions;
}

interface REAssumptions {
  id: number;
  rent_inc: number;
  property_inc: number;
  inflation: number;
  rent: number;
  maintenance_fee: number;
  repairs: number;
  property_tax: number;
  utilities: number;
  insurance: number;
  management_fee: number;
  other_expenses: number[];
  closing_cost: number;
  down_percent: number;
  interest_rate: number;
  hold_length: number;
  mortgage_length: number;
}

export class REAnalyzer {
  private assumptions: REAssumptions;
  private purchasePrice: number;
  public totalOutOfPocket: number;
  public rent: number;
  public mortgagePayment: number;
  public avgRent: number;
  public avgTotalOpExpense: number;
  public cashFlowCumulative: number[];
  public cashFlow: number[];

  constructor(reAsset: REAsset) {
    this.assumptions = reAsset.re_assumptions;
    this.purchasePrice = reAsset.purchase_price;
    this.totalOutOfPocket = this.purchasePrice * this.assumptions.down_percent / 100 + this.assumptions.closing_cost;
    this.rent = this.assumptions.rent;


    const {
      hold_length,
      down_percent,
      interest_rate,
      rent_inc,
      mortgage_length,
      insurance,
      maintenance_fee,
      utilities,
      other_expenses,
      property_tax,
      repairs,
      inflation,
      property_inc
    } = this.assumptions;
    /* Mortgage Payments */
    let monthlyRate = interest_rate / 12 / 100;
    let mortgageAmount = this.purchasePrice * (1 - down_percent / 100); // After talking to the banks, they only look at the purchase price.
    this.mortgagePayment = Math.round(mortgageAmount * monthlyRate / (1 - (1 / Math.pow(1 + monthlyRate, mortgage_length * 12))));

    /* Equity */
    let remainingMortgage = mortgageAmount;
    for (let i = 0; i < hold_length * 12; i++) {
      let interestAmount = remainingMortgage * (interest_rate / 100 / 12);
      remainingMortgage = remainingMortgage + interestAmount - this.mortgagePayment;
    }

    /* Rent */
    let rents = [...Array(hold_length).keys()].map((year: number) => (this.rent * Math.pow(1 + rent_inc / 100, year)));
    this.avgRent = rents.reduce((pv, cv) => pv + cv, 0) / rents.length;

    /* Operation Expenses */
    let totalOpExpense = (insurance / 12
      + maintenance_fee
      + utilities
      + other_expenses.reduce((pv, cv) => pv + cv, 0)
      + property_tax / 12
      + repairs / 100 * this.purchasePrice / 12
    );

    let totalOpExpenses = [...Array(hold_length).keys()].map((year: number) => (totalOpExpense * Math.pow(1 + inflation / 100, year)));
    this.avgTotalOpExpense = totalOpExpenses.reduce((pv, cv) => pv + cv, 0) / totalOpExpenses.length;

    /* Cash Flow */
    this.cashFlow = rents.map((rent, i) => Math.round((rent - totalOpExpenses[i] - ((i >= mortgage_length) ? 0 : this.mortgagePayment)) * 100) / 100);
    let cumulativeCash = 0;
    this.cashFlowCumulative = [0]
    this.cashFlow.forEach((cash, i) => {
      cumulativeCash += cash;
      this.cashFlowCumulative.push(Math.round(cumulativeCash * 100) / 100);
    })
    /* Sell the property at the final year */
    this.cashFlowCumulative[this.cashFlowCumulative.length - 1] = Math.round((
      this.cashFlowCumulative[this.cashFlowCumulative.length - 1]
      + this.purchasePrice * Math.pow((1 + property_inc / 100), hold_length) * (1 - 0.075) // 7.5% commision for realtor
      - remainingMortgage
    ) * 100) / 100;

  }

}