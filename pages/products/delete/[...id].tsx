import Layout from "@/components/Layout"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import axios from "axios"
import { product } from "@/types"

export default function DeletePage() {
	const router = useRouter()

	const [productInfo, setProductInfo] = useState<product>()

	const { id } = router.query

	function goBack() {
		router.push("/products")
	}

	async function deleteProduct() {
		axios.delete("/api/products?id=" + id)
		goBack()
	}

	useEffect(() => {
		if (!id) {
			return
		}
		axios.get("/api/products?id=" + id).then((res) => setProductInfo(res.data))
	}, [id])

	return (
		<Layout>
			<h1 className="text-center">
				{"Do you really want to delete " + '"' + productInfo?.title + '"' + "?"}
			</h1>
			<div className="flex gap-2 justify-center">
				<button
					className="btn-red"
					onClick={() => {
						deleteProduct()
					}}>
					{"Yes"}
				</button>
				<button
					className="btn-default"
					onClick={() => {
						goBack()
					}}>
					{"No"}
				</button>
			</div>
		</Layout>
	)
}
