// MongoDB initialization script
const db = db.getSiblingDB("unified-toolkit")

// Create collections
db.createCollection("users")
db.createCollection("otps")
db.createCollection("scanlogs")

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ username: 1 }, { unique: true })
db.otps.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
db.otps.createIndex({ userId: 1 })
db.scanlogs.createIndex({ userId: 1 })
db.scanlogs.createIndex({ createdAt: -1 })

print("Database initialized successfully")
