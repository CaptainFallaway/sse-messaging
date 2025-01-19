import { signal } from "@preact/signals";
import { username } from "../globals";
import { SendHorizonal } from "lucide-preact";

export function Input() {
    const inpt = signal("");

	const sendMessage = async () => {
		if (inpt.value === "") {
			return;
		}

        const message = {
            author: username.value,
            message: inpt.value,
        }

		const body = JSON.stringify(message);
        inpt.value = "";

		await fetch("send", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: body,
		});
	};

	const handleKeyUp = (ev: KeyboardEvent) => {
		if (ev.key === "Enter") {
			sendMessage();
		}
	};

	return (
		<div className="flex items-center w-[94%] lg:w-[40%] space-x-2">
			<input
				id="input"
				type="text"
				placeholder="Type message"
				className="input input-bordered w-full"
				onKeyUp={handleKeyUp}
                value={inpt}
				onInput={(ev) => (inpt.value = ev.currentTarget.value)}
			/>
			<div className="tooltip" data-tip="Shortcut: Enter">
				<button className="btn btn-primary w-32" onClick={sendMessage}>
					Send
					<SendHorizonal size="18" />
				</button>
			</div>
		</div>
	);
}
