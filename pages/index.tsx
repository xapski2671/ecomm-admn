import { useSession, signIn, signOut } from "next-auth/react"

export default function Home() {
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
		<div className="bg-blue-900 min-h-screen">
			{"Logged in "}
			{session.user?.email}
		</div>
	)
}
