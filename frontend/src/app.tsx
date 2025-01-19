import { Messages } from "./components/messages";
import { Input } from "./components/input";
import { Profile } from "./components/profile";

export function App() {
	return (
		<>
			<Profile />
			<div className="flex py-8 flex-col space-y-5 h-screen w-full items-center">
				<Messages />
				<Input />
			</div>
		</>
	);
}
