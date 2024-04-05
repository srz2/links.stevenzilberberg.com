require('dotenv').config();

console.log('***********CONFIG**************')
console.log('Port Number:', process.env.PORT || 5000)
console.log("DB Name:", process.env.MONGO_DB_LINKS_NAME)
console.log('DB Username:', process.env.MONGO_DB_LINKS_USERNAME)
console.log('DB Password:', process.env.MONGO_DB_LINKS_PASSWORD ? "Password Set" : "Not Set")
console.log('*******************************')

module.exports = {
    PORT: process.env.PORT || 5000,
    REDIRECT_URL: process.env.REDIRECT_URL || `https://localhost${PORT}`,
    DB : {
        LINKS : {
            Username: process.env.MONGO_DB_LINKS_USERNAME,
            Password: process.env.MONGO_DB_LINKS_PASSWORD,
            Name: process.env.MONGO_DB_LINKS_NAME,
        }
    }
}