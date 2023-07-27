import Nav from "@/components/Nav"
import { useSession, signIn, signOut } from "next-auth/react"
import { ReactNode } from "react"

export default function Layout({ children }: { children: ReactNode }) {
	const { data: session } = useSession()
	if (!session) {
		return (
			<div>
				<div>
					<button
						onClick={() => {
							signIn("google")
						}}>
						{"Log in with Google"}
					</button>
				</div>
			</div>
		)
	}
	return (
		<div className="bg-blue-900 min-h-screen flex">
			<Nav />
			<div className="bg-white flex-grow mt-2 mr-2 mb-2 rounded-lg p-4">
				{children}
			</div>
		</div>
	)
}
