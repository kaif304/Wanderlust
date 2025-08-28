const bcrypt = require("bcrypt")

let hashedPass = async (password) => {
    try{
        const hash = await bcrypt.hash(password,12)
        return hash
    }
    catch(err){
        console.log(err)
    }
}

let main = async () => {
    const hashedPassword = await hashedPass("kaif")
    console.log(hashedPassword)
}

main();