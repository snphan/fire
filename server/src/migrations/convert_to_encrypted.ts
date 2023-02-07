import { dbConnection } from "../databases";
import { PlaidInfo } from "../entities/plaid_info.entity";
import { DataSource } from "typeorm";

/* Command to run: 
  NODE_ENV=development npx ts-node -r tsconfig-paths/register convert_to_encrypted.ts 


  Steps
  1. Add a new column (col B) to the table. Configure the column to be encrypted. Remove the transformer from the original column (col A).
  1. Write a script that queries all of the entries in the table. Set the value of col B to col A.
  1. Save all the records.
  1. Rename col A to something else manually.
  1. Rename col B to the original name of col A manually.
  1. Remove the typeorm configuration for col A.
  1. Rename the typeorm configuration for col B to col A's name.
  1. Remove col A (unencrypted column) from the table manually.

*/

console.log("Hello world!");

const main = async () => {
  const newDbConnection = { ...dbConnection, host: "localhost" }
  const appDataSource = new DataSource(newDbConnection);
  const response = await appDataSource.initialize();
  const findPlaidInfo = await PlaidInfo.find();

  console.log(findPlaidInfo);
  /* 
  Change the columns here, change the attributes to the correct one.
  we are assigning the unencrypted to a new encrypted column
   */
  // for (const item of findPlaidInfo) {
  //   await PlaidInfo.update(item.id, { products_new: item.products })
  // }
}

main();
