
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
      inflation
    } = this.assumptions;
    /* Mortgage Payments */
    let monthlyRate = interest_rate / 12 / 100;
    let mortgageAmount = this.purchasePrice * (1 - down_percent / 100);
    this.mortgagePayment = Math.round(mortgageAmount * monthlyRate / (1 - (1 / Math.pow(1 + monthlyRate, mortgage_length * 12))));

    /* Rent */
    let rents = [...Array(hold_length + 1).keys()].map((year: number) => (this.rent * Math.pow(1 + rent_inc / 100, year)));
    console.log("rents", rents);
    this.avgRent = rents.reduce((pv, cv) => pv + cv, 0) / rents.length;

    /* Operation Expenses */
    let totalOpExpense = (insurance / 12
      + maintenance_fee
      + utilities
      + other_expenses.reduce((pv, cv) => pv + cv, 0)
      + property_tax / 12
      + repairs / 100 * this.purchasePrice / 12
    );

    let totalOpExpenses = [...Array(hold_length + 1).keys()].map((year: number) => (totalOpExpense * Math.pow(1 + inflation / 100, year)));
    this.avgTotalOpExpense = totalOpExpenses.reduce((pv, cv) => pv + cv, 0) / totalOpExpenses.length;
  }

}