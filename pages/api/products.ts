// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import clientPromise from "@/lib/mongodb"
import { Product } from "@/models/Product"
import mongoose from "mongoose"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	const { method } = req
	mongoose.Promise = clientPromise
	if (method == "POST") {
		const { title, description, price } = req.body
		const productDoc = await Product.create({
			title,
			description,
			price,
		})
		res.json(productDoc)
	}
}
