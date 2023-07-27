import { product } from "@/types"
import axios from "axios"
import { ObjectId } from "mongoose"
import { useRouter } from "next/router"
import { useState } from "react"

interface props {
	_id?: ObjectId
	title?: string
	description?: string
	price?: number
	__v?: number
}

export default function ProductForm(productInfo?: props) {
	const router = useRouter()

	const [title, setTitle] = useState(productInfo?.title || "")
	const [description, setDescription] = useState(productInfo?.description || "")
	const [price, setPrice] = useState(productInfo?.price || "")
	const [goToProducts, setGoToProducts] = useState(false)
	const [Images, setImages] = useState()

	async function saveProduct() {
		const data = { title, description, price }
		if (productInfo?._id) {
			await axios.put("/api/products", { _id: productInfo._id, ...data })
		} else {
			await axios.post("/api/products", data)
		}
		setGoToProducts(true)
	}

	if (goToProducts) {
		router.push("/products")
	}

	async function uploadImages(imgs: any) {
		if (imgs) {
			const data = new FormData()
			for (const img of imgs) {
				data.append("img", img)
			}
			const res = await axios.post("/api/upload", data)
		}
	}

	return (
		<form
			className="flex flex-col gap-2"
			onSubmit={(e) => {
				e.preventDefault()
				saveProduct()
			}}
		>
			<label>{"Product Name"}</label>
			<input
				type="text"
				placeholder="product name"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
			/>
			<label>{"Photos"}</label>
			<div className="mb-2">
				<label
					className="w-24 h-24 border text-center flex 
					items-center justify-center text-sm gap-1 text-gray-500 
					rounded-lg cursor-pointer"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-6 h-6"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
						/>
					</svg>
					{"Upload"}
					<input
						type="file"
						hidden
						onChange={(e) => {
							uploadImages(e.target.files)
						}}
					/>
				</label>
				<div>{"No photos in this product"}</div>
			</div>
			<label>{"Description"}</label>
			<textarea
				placeholder="description"
				value={description}
				onChange={(e) => setDescription(e.target.value)}
			/>
			<label>{"Price(in USD)"}</label>
			<input
				type="number"
				placeholder="price"
				value={price}
				onChange={(e) => setPrice(e.target.value)}
			/>
			<button type="submit" className="btn-primary">
				{"Save"}
			</button>
		</form>
	)
}
