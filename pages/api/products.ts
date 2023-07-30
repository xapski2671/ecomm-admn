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
		const { title, description, price, images, category } = req.body
		const productDoc = await Product.create({
			title,
			description,
			price,
			images,
			category,
		})
		res.json(productDoc)
	}

	if (method == "PUT") {
		const { title, description, price, _id, images, category } = req.body
		await Product.updateOne(
			{ _id },
			{ title, description, price, images, category }
		)
		res.json(true)
	}

	if (method == "DELETE") {
		if (req.query.id) {
			await Product.deleteOne({ _id: req.query.id })
			res.json(true)
		}
	}
}
