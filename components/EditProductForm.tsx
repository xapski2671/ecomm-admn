import { product } from "@/types"
import { ReactNode, useState } from "react"
import axios from "axios"
import { useRouter } from "next/router"

interface props {
	productInfo: product
}

export default function EditProductForm({ productInfo }: props) {
	const router = useRouter()

	const [title, setTitle] = useState(productInfo.title || "")
	const [description, setDescription] = useState(productInfo.description || "")
	const [price, setPrice] = useState(productInfo.price || "")
	const [goToProducts, setGoToProducts] = useState(false)

	async function createProduct() {
		const data = { title, description, price }
		await axios.post("/api/products", data)
		setGoToProducts(true)
	}

	if (goToProducts) {
		router.push("/products")
	}

	return (
		<form
			className="flex flex-col gap-2"
			onSubmit={(e) => {
				e.preventDefault()
				createProduct()
			}}>
			<h1>{"Edit Product"}</h1>
			<label>{"Product Name"}</label>
			<input
				type="text"
				placeholder="product name"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
			/>
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
