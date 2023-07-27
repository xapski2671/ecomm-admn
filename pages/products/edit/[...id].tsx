import Layout from "@/components/Layout"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import axios from "axios"
import ProductForm from "@/components/ProductForm"

export default function EditProductPage() {
	const router = useRouter()

	const [productInfo, setProductInfo] = useState<any>(null)

	const { id } = router.query

	useEffect(() => {
		if (!id) {
			return
		}
		axios.get("/api/products?id=" + id).then((res) => setProductInfo(res.data))
	}, [id])

	return <Layout>{productInfo && <ProductForm {...productInfo} />}</Layout>
}
