import { mongooseConnect } from "@/lib/mongoose"
import { Product } from "@/models/Product"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	const { method } = req
	await mongooseConnect()

	if (method == "GET") {
		if (req.query.id) {
			res.json(await Product.findById(req.query.id))
		} else {
			res.json(await Product.find())
		}
	}

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
