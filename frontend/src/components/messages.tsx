import { Signal, useSignal } from "@preact/signals";
import { Message } from "../types";
import { useEffect } from "preact/hooks";
import { username } from "../globals";

export function Messages() {
	const messages: Signal<Message[]> = useSignal([]);

	useEffect(() => {
		const evtSource = new EventSource("subscribe");

		evtSource.addEventListener("open", (event: MessageEvent<string>) => {
			if (!event.data) return;
			const lines: string[] = event.data.split("\n");
			const data: Message[] = lines.map(
				(line: string) => JSON.parse(line) as Message
			);
			messages.value = data;
		});

		evtSource.addEventListener("message", (event: MessageEvent<string>) => {
			const data = JSON.parse(event.data) as Message;
			messages.value = [...messages.value, data];
			if (messages.value.length > 100) {
				messages.value = messages.value.slice(1);
			}
		});

		return () => {
			evtSource.close();
		};
	}, []);

	return (
		<div className="flex flex-col-reverse overflow-y-scroll rounded h-full w-full lg:w-[40%]">
			<div className="flex flex-col space-y-3 py-4 lg:px-2">
				{messages.value.map((message) => (
					<ChatBubble key={message.id} {...message} />
				))}
			</div>
		</div>
	);
}

function ChatBubble({ author, message }: Message) {
	return (
		<div
			className={`chat ${
				username.value == author ? "chat-end" : "chat-start"
			}`}
		>
			<div
				className={`chat-bubble ${
					username.value == author ? "bg-default" : "bg-neutral"
				}`}
			>
				<strong>{author}</strong>
				<p>{message}</p>
			</div>
		</div>
	);
}
