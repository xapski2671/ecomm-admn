import { ObjectId } from "mongoose"

export interface product {
	_id: ObjectId
	title: string
	description: string
	price: number
	__v: number
}
