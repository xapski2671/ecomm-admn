import { product, property } from "@/types"
import axios from "axios"
import { ObjectId } from "mongoose"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Spinner from "./Spinner"

interface props {
	_id?: ObjectId
	title?: string
	description?: string
	price?: number
	__v?: number
	images?: string[]
	category?: ObjectId
	properties?: Object
}

interface sortableItem {
	id: string
	name: string
}

export default function ProductForm(productInfo?: props) {
	const router = useRouter()

	const [title, setTitle] = useState(productInfo?.title || "")
	const [description, setDescription] = useState(productInfo?.description || "")
	const [price, setPrice] = useState(productInfo?.price || "")
	const [goToProducts, setGoToProducts] = useState(false)
	const [images, setImages] = useState(productInfo?.images || [])
	const [isUploading, setIsUploading] = useState(false)
	const [categories, setCategories] = useState([])
	const [category, setCategory] = useState<any>(
		productInfo?.category?.toString() || ""
	)
	const [productProperties, setProductProperties] = useState<any>(
		productInfo?.properties || {}
	)

	async function saveProduct() {
		const data = {
			title,
			description,
			price,
			images,
			category,
			properties: productProperties,
		}
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
			setIsUploading(true)
			const data = new FormData()
			for (const img of imgs) {
				data.append("img", img)
			}
			const res = await axios.post("/api/upload", data)
			setImages((prev) => [...prev, ...res.data.links])
			setIsUploading(false)
		}
	}

	const propertiesToFill = []
	if (categories.length > 0 && category) {
		let catInfo: any = categories.find(({ _id }) => _id === category)
		propertiesToFill.push(...catInfo?.properties)
		while (catInfo?.parent?._id) {
			const parentCat: any = categories.find(
				({ _id }) => _id === catInfo?.parent?._id
			)
			propertiesToFill.push(...parentCat.properties)
			catInfo = parentCat
		}
	}

	function setProductProp(propName: string, value: string) {
		setProductProperties((prev: any) => {
			const newProductProps = { ...prev }
			newProductProps[propName] = value
			return newProductProps
		})
	}

	useEffect(() => {
		axios.get("/api/categories").then((res) => setCategories(res.data))
	}, [])

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
			<label>{"Category"}</label>
			<select value={category} onChange={(e) => setCategory(e.target.value)}>
				<option value="">{"Uncategorized"}</option>
				{categories.length > 0 &&
					categories.map((c: any, index) => {
						return (
							<option value={c._id} key={index}>
								{c.name}
							</option>
						)
					})}
			</select>
			{propertiesToFill.length > 0 &&
				propertiesToFill.map((p: any, index) => {
					return (
						<div key={index} className="flex gap-1">
							<div>{p.name}</div>
							<select
								value={productProperties[p.name]}
								onChange={(e) => {
									setProductProp(p.name, e.target.value)
								}}
							>
								{p.values.map((v: any, index: number) => {
									return (
										<option value={v} key={index}>
											{v}
										</option>
									)
								})}
							</select>
						</div>
					)
				})}
			<label>{"Photos"}</label>
			<div className="mb-2 flex flex-wrap gap-2">
				{images.length > 0 &&
					images.map((link, index) => {
						return (
							<div key={index} className="h-24">
								<img src={link} alt="product-img" className="rounded-lg" />
							</div>
						)
					})}
				{isUploading && (
					<div className="h-24 p-1 flex items-center">
						<Spinner />
					</div>
				)}
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
			</div>
			<label>{"Description"}</label>
			<textarea
				placeholder="description"
				value={description}
				onChange={(e) => setDescription(e.target.value)}
			/>
			<label>{"Price (in USD)"}</label>
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
