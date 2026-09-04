import bcrypt from "bcrypt"


export const createHash = async password => {
  return await bcrypt.hash(password, 10)
}



export const isValidPassword = (password, hashedPassword) => {
  return  bcrypt.compareSync(password, hashedPassword)
}