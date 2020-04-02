import { mapType } from "./mapType"
import { toGraphQL } from "./toGraphQL"
import { toTypeScript } from "./toTypeScript"
import { t } from "./types"

const device = t.object("Device", {
  id: t.string(),
  userId: t.string(),
  publicKey: t.bytes()
})

const user = t.object("User", {
  id: t.string(),
  email: t.string(),
  hashedAndSaltedPassword: t.bytes(),
  devices: t.array(device)
})

const gqlUser = mapType(user).drop("hashedAndSaltedPassword")

const gqlDevice = mapType(device)
  .take("id", "publicKey")
  .add("user", user)

console.log("DB User Type:")
console.log(toTypeScript(user))

console.log("GQL User Type:")
console.log(toGraphQL(gqlUser.get()))

console.log("DB Device Type:")
console.log(toTypeScript(device))

console.log("GQL Device Type:")
console.log(toGraphQL(gqlDevice.get()))
