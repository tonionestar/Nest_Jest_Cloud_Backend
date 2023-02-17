import { Users } from "../entity/Users";
import { UsersBilling } from "../entity/UsersBilling";
import seedUsers from "./entities/users.json"
import seedBillings from "./entities/billing.json"
import { ClippicDataSource } from "../../database/DatabaseConnection";

if (process.env.NODE_ENV === "dev") {
    seedData();
} else {
    console.log("Seed-data should not run on production DB")
}

async function seedData() {
    await ClippicDataSource.initialize()
    console.log("Connected to DB")

    const usersRepo = ClippicDataSource.getRepository(Users)
    await usersRepo.save(seedUsers)

    const billingRepo = ClippicDataSource.getRepository(UsersBilling)
    await billingRepo.save(seedBillings)

    await ClippicDataSource.destroy()
    console.log("Seed db finished successfully")
}
