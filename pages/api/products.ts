import { mongooseConnect } from "@/lib/mongoose"
import { Product } from "@/models/Product"
import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import authOptions, { isAdmin } from "@/pages/api/auth/[...nextauth]"

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	const { method } = req
	await mongooseConnect()
	await isAdmin(req, res)

	if (method == "GET") {
		if (req.query.id) {
			res.json(await Product.findById(req.query.id))
		} else {
			res.json(await Product.find())
		}
	}

	if (method == "POST") {
		const { title, description, price, images, category, properties } = req.body
		const productDoc = await Product.create({
			title,
			description,
			price,
			images,
			category,
			properties,
		})
		res.json(productDoc)
	}

	if (method == "PUT") {
		const { title, description, price, _id, images, category, properties } =
			req.body
		await Product.updateOne(
			{ _id },
			{ title, description, price, images, category, properties }
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
