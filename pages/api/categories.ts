import { mongooseConnect } from "@/lib/mongoose"
import { Category } from "@/models/Category"
import { Product } from "@/models/Product"
import type { NextApiRequest, NextApiResponse } from "next"
import { isAdmin } from "./auth/[...nextauth]"

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	const { method } = req
	await mongooseConnect()
	await isAdmin(req, res)

	if (method === "GET") {
		res.json(await Category.find().populate("parent"))
	}

	if (method === "POST") {
		const { name, parent, properties } = req.body
		const categoryDoc = await Category.create({ name, parent, properties })
		res.json(categoryDoc)
	}

	if (method === "PUT") {
		const { name, parent, _id, properties } = req.body
		const categoryDoc = await Category.updateOne(
			{ _id },
			{ name, parent, properties }
		)
		res.json(categoryDoc)
	}

	if (method === "DELETE") {
		const { _id } = req.query
		await Category.deleteOne({ _id })
		res.json(true)
	}
}
