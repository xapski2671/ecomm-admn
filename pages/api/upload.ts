import { mongooseConnect } from "@/lib/mongoose"
import { Product } from "@/models/Product"
import type { NextApiRequest, NextApiResponse } from "next"
import multiparty from "multiparty"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import fs from "fs"
import mime from "mime-types"

const bucketName = "xps-ecomm"

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	const form = new multiparty.Form()
	form.parse(req, async (err, fields, files) => {
		console.log(files)
		const client = new S3Client({
			region: "eu-north-1",
			credentials: {
				accessKeyId: process.env.S3_ACCESS_KEY!,
				secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
			},
		})
		const links = []
		for (const file of files.img) {
			const ext = file.originalFilename.split(".").pop() // to get the file extension
			const newFilename = Date.now() + "." + ext
			await client.send(
				new PutObjectCommand({
					Bucket: bucketName,
					Key: newFilename,
					Body: fs.readFileSync(file.path),
					ACL: "public-read",
					ContentType: mime.lookup(file.path).toString(),
				})
			)
			const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`
			links.push(link)
		}

		res.json({ links })
	})
}

export const config = {
	api: { bodyParser: false }, // we will parse our data manually
}
