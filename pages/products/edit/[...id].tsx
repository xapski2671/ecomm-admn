import Layout from "@/components/Layout"
import ProductForm from "@/components/ProductForm"
import { product } from "@/types"
import axios from "axios"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function EditProductPage() {
	const router = useRouter()

	const [productInfo, setProductInfo] = useState<product>()

	const { id } = router.query

	useEffect(() => {
		if (!id) {
			return
		}
		axios.get("/api/products?id=" + id).then((res) => setProductInfo(res.data))
	}, [id])

	return (
		<Layout>
			<h1>{"Edit Product"}</h1>
			{productInfo && (
				<ProductForm
					price={productInfo.price}
					title={productInfo.title}
					description={productInfo.description}
					_id={productInfo._id}
					__v={productInfo.__v}
				/>
			)}
		</Layout>
	)
}
