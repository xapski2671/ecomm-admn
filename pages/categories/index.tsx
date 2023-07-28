import Layout from "@/components/Layout"
import { category } from "@/types"
import axios from "axios"
import { useEffect, useState } from "react"

export default function Categories() {
	const [name, setName] = useState("")
	const [categories, setCategories] = useState([])
	const [parentCategory, setParentCategory] = useState("")
	const [editedCategory, setEditedCategory] = useState<category>()

	async function saveCategory() {
		const data = { name, parent: parentCategory }
		if (editedCategory) {
			await axios.put("/api/categories", { _id: editedCategory._id, ...data })
			setEditedCategory(undefined)
		} else {
			await axios.post("/api/categories", data)
		}
		setName("")
		await fetchCategories()
	}

	async function fetchCategories() {
		await axios.get("/api/categories").then((res) => {
			setCategories(res.data)
		})
	}

	function editCategory(category: category) {
		setEditedCategory(category)
		setName(category.name.toString())
		setParentCategory(
			category.parent?._id ? category.parent._id.toString() : ""
		)
	}

	async function deleteCategory(category: category) {
		await axios.delete("/api/categories?_id=" + category._id)
		await fetchCategories()
	}

	useEffect(() => {
		fetchCategories()
	}, [])

	return (
		<Layout>
			<h1>{"Categories"}</h1>
			<label>{editedCategory ? "Edit category" : "Create new category"}</label>
			<form
				onSubmit={(e) => {
					e.preventDefault()
					saveCategory()
				}}
				className="flex gap-1"
			>
				<input
					type="text"
					placeholder="Category Name"
					className="mb-0"
					onChange={(e) => {
						setName(e.target.value)
					}}
					value={name}
				/>
				<select
					className="mb-0"
					value={parentCategory}
					onChange={(e) => setParentCategory(e.target.value)}
				>
					<option value="">{"No parent category"}</option>
					{categories.length > 0 &&
						categories.map((category: category, index) => {
							return (
								<option key={index} value={category._id.toString()}>
									{category.name}
								</option>
							)
						})}
				</select>
				<button className="btn-primary py-1" type="submit">
					{"Save"}
				</button>
			</form>

			<table className="basic mt-4">
				<thead>
					<tr>
						<td>{"Category name"}</td>
						<td>{"Parent Category"}</td>
						<td></td>
					</tr>
				</thead>
				<tbody>
					{categories.length > 0 &&
						categories.map((category: any, index) => {
							return (
								<tr key={index}>
									<td>{category.name}</td>
									<td>{category?.parent?.name}</td>
									<td>
										<button
											className="btn-primary mr-1"
											onClick={() => {
												editCategory(category)
											}}
										>
											{"Edit"}
										</button>
										<button
											className="btn-primary"
											onClick={() => {
												deleteCategory(category)
											}}
										>
											{"Delete"}
										</button>
									</td>
								</tr>
							)
						})}
				</tbody>
			</table>
		</Layout>
	)
}
