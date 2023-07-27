import mongoose from "mongoose"

// mongoose ORM client
export function mongooseConnect() {
	if (!process.env.MONGODB_URI) {
		throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
	}
	const uri = process.env.MONGODB_URI
	if (mongoose.connection.readyState == 1) {
		return mongoose.connection.asPromise()
	} else {
		return mongoose.connect(uri, { dbName: "EcommShop" })
	}
}
