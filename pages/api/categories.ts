import { mongooseConnect } from "@/lib/mongoose"
import { Category } from "@/models/Category"
import { Product } from "@/models/Product"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	const { method } = req
	await mongooseConnect()

	if (method === "GET") {
		res.json(await Category.find().populate("parent"))
	}

	if (method === "POST") {
		const { name, parent } = req.body
		const categoryDoc = await Category.create({ name, parent })
		res.json(categoryDoc)
	}

	if (method === "PUT") {
		const { name, parent, _id } = req.body
		const categoryDoc = await Category.updateOne({ _id }, { name, parent })
		res.json(categoryDoc)
	}

	if (method === "DELETE") {
		const { _id } = req.query
		await Category.deleteOne({ _id })
		res.json(true)
	}
}