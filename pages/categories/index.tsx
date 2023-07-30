import Layout from "@/components/Layout"
import { category } from "@/types"
import axios from "axios"
import { useEffect, useState } from "react"

export default function Categories() {
	const [name, setName] = useState("")
	const [categories, setCategories] = useState([])
	const [parentCategory, setParentCategory] = useState("")
	const [editedCategory, setEditedCategory] = useState<category>()
	const [properties, setProperties] = useState<any[]>([])

	async function saveCategory() {
		const data = { name, parent: parentCategory, properties }
		if (editedCategory) {
			await axios.put("/api/categories", { _id: editedCategory._id, ...data })
			setEditedCategory(undefined)
		} else {
			await axios.post("/api/categories", data)
		}
		setName("")
		setParentCategory("")
		setProperties([])

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
		setProperties(category.properties || [])
	}

	async function deleteCategory(category: category) {
		await axios.delete("/api/categories?_id=" + category._id)
		await fetchCategories()
	}

	function addProperty() {
		setProperties((prev) => [...prev, { name: "", values: [] }])
	}

	function handlePropertyNameChange(newName: string, index: number) {
		setProperties((prev) => {
			const properties = [...prev]
			properties[index].name = newName
			return properties
		})
	}

	function handlePropertyValuesChange(newValues: string, index: number) {
		setProperties((prev) => {
			const properties = [...prev]
			properties[index].values = newValues.split(",")
			return properties
		})
	}

	function removeProperty(index: number) {
		setProperties((prev) => {
			const newProperties = prev.filter((p, idx) => {
				return idx !== index
			})

			return newProperties
		})
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
			>
				<div className="flex gap-1">
					<input
						type="text"
						placeholder="Category Name"
						onChange={(e) => {
							setName(e.target.value)
						}}
						value={name}
					/>
					<select
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
				</div>

				<div className="mb-2">
					<label className="block">{"Properties"}</label>
					{properties.length > 0 &&
						properties.map((p: any, idx) => {
							return (
								<div className="flex gap-1" key={idx}>
									<input
										type="text"
										placeholder="property name (example: color)"
										value={p.name}
										onChange={(e) => {
											handlePropertyNameChange(e.target.value, idx)
										}}
									/>
									<input
										type="text"
										placeholder="values, comma separated"
										value={p.values}
										onChange={(e) => {
											handlePropertyValuesChange(e.target.value, idx)
										}}
									/>
									<button
										type="button"
										className="mb-2 btn-default"
										onClick={() => {
											removeProperty(idx)
										}}
									>
										{"Remove"}
									</button>
								</div>
							)
						})}
					<button
						className="btn-default text-sm"
						type="button"
						onClick={() => {
							addProperty()
						}}
					>
						{"Add new property"}
					</button>
				</div>
				<div className="flex gap-1">
					<button className="btn-primary py-1" type="submit">
						{"Save"}
					</button>
					{editedCategory && (
						<button
							type="button"
							className="btn-default"
							onClick={() => {
								setEditedCategory(undefined)
								setName("")
								setParentCategory("")
								setProperties([])
							}}
						>
							{"Cancel"}
						</button>
					)}
				</div>
			</form>

			{!editedCategory && (
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
			)}
		</Layout>
	)
}
