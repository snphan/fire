
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
  other_expenses: number;
  closing_cost: number;
  down_percent: number;
  interest_rate: number;
  hold_length: number;
}

export class REAnalyzer {
  private assumptions: REAssumptions;
  private purchasePrice: number;
  public totalOutOfPocket: number;

  constructor(reAsset: REAsset) {
    this.assumptions = reAsset.re_assumptions;
    this.purchasePrice = reAsset.purchase_price;
    this.totalOutOfPocket = this.purchasePrice * this.assumptions.down_percent / 100 + this.assumptions.closing_cost;
    console.log(this.assumptions.hold_length);
  }

}