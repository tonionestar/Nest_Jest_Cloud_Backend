import { ClippicDataSource } from "../DatabaseConnection";
import seedBillings from "./entities/billing.json";
import seedShippings from "./entities/shipping.json";
import seedUsers from "./entities/users.json";
import { Users } from "../entity/Users";
import { UsersBilling } from "../entity/UsersBilling";
import { UsersShipping } from "../entity/UsersShipping";

if (process.env.NODE_ENV === "dev") {
    seedData();
} else {
    console.log("Seed-data should not run on production DB");
}

async function seedData() {
    await ClippicDataSource.initialize();
    console.log("Connected to DB");

    const usersRepo = ClippicDataSource.getRepository(Users);
    await usersRepo.save(seedUsers);

    const billingRepo = ClippicDataSource.getRepository(UsersBilling);
    await billingRepo.save(seedBillings);

    const shippingRepo = ClippicDataSource.getRepository(UsersShipping);
    await shippingRepo.save(seedShippings);

    await ClippicDataSource.destroy();
    console.log("Seed db finished successfully");
}
