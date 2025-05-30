import CustomerAccount from "../models/CustomerAccount.js";

class CustomerAccountService {
  static async getAll() {
    return await CustomerAccount.getAll();
  }

  static async getById(accountId) {
    const result = await CustomerAccount.findById(accountId);
    if (!result) throw new Error("Account not found");
    return result;
  }
  static async getById(accountId) {
    const result = await CustomerAccount.findById(accountId);
    if (!result) throw new Error("Account not found");
    return result;
  }

  static async create(data) {
    if (
      !data.username ||
      !data.fullname ||
      !data.phone ||
      !data.email ||
      !data.password
    ) {
      throw new Error("Missing required fields");
    }
    return await CustomerAccount.create(data);
  }

  static async update(accountId, data) {
    return await CustomerAccount.update(accountId, data);
  }

  static async delete(accountId) {
    await this.getById(accountId); // Check existence
    return await CustomerAccount.delete(accountId);
  }

  static async findById(accountId) {
    return await CustomerAccount.findById(accountId);
  }

  static async findUserByPhone(phone) {
    return await CustomerAccount.findUserByPhone(phone);
  }

  static async findUserByEmail(email) {
    return await CustomerAccount.findUserByEmail(email);
  }

  static async findCustomerByIdentifier(identifier) {
    return await CustomerAccount.findCustomerByIdentifier(identifier);
  }

  static async findByIdAndUpdatePassword(id, hashedPassword) {
    return await CustomerAccount.findByIdAndUpdatePassword(id, hashedPassword);
  }

  static async findByEmailAndUpdateVerificationCode(
    email,
    verification,
    expirationTime
  ) {
    return await CustomerAccount.findByEmailAndUpdateVerificationCode(
      email,
      verification,
      expirationTime
    );
  }
}

export default CustomerAccountService;
