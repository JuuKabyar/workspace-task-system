// Password hash / compare လုပ်တဲ့ function တွေထားရမယ်

import bcrypt from "bcrypt";

// Convert plain password to hashed password
export const hashPassword = async (password:string) => {
    const hashedPassword = await bcrypt.hash(
        password, 
        10
    );

    return hashedPassword;
};

// Compare plain pass with hashed pass
export const comparePassword = async (password:string, hashedPassword: string) => {
    const isMatch = await bcrypt.compare (
        password,
        hashedPassword
    );

    return isMatch;
}