import Layout from "@/components/Layout"
import ProductForm from "@/components/ProductForm"
import axios from "axios"
import { useRouter } from "next/router"
import { useState } from "react"

export default function NewLayout() {
	const router = useRouter()

	const [title, setTitle] = useState("")
	const [description, setDescription] = useState("")
	const [price, setPrice] = useState("")
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
		<Layout>
			<ProductForm />
		</Layout>
	)
}
