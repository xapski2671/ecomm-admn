import { ObjectId } from "mongoose"

export interface product {
	_id: ObjectId
	title: string
	description: string
	price: number
	__v: number
	images: string[]
}

export interface category {
	_id: ObjectId
	name: String
	parent?: category
	__v: string
}
