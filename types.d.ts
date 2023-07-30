import { ObjectId } from "mongoose"

export interface product {
	_id: ObjectId
	title: string
	description?: string
	price: number
	__v: number
	images?: string[]
	category?: ObjectId
}

export interface category {
	_id: ObjectId
	name: String
	parent?: category
	properties?: property[]
	__v: string
}

export interface property {
	name: string
	values: string[]
}
