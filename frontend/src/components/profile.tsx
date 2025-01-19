import { useEffect } from "preact/hooks";
import { firstTime, theme, themes, username } from "../globals";
import { Modal } from "../types";
import { User2 } from "lucide-preact";

export function Profile() {
	const showModal = () => {
		const accountModal = document.getElementById(
			"accountModal"
		) as unknown as Modal;
		accountModal.showModal();
	};

	useEffect(() => {
		if (firstTime) {
			showModal();
		}
	}, []);

	return (
		<>
			<ProfileModal />

			<button
				className="btn btn-primary absolute right-0 m-5 h-max"
				onClick={showModal}
			>
				<div className="flex items-center my-3 space-x-4">
					<p className="text-xl">{username}</p>
					<User2 size="48" />
				</div>
			</button>
		</>
	);
}

function ProfileModal() {
	var name = "";

	const submit = () => {
		if (name !== "") {
			username.value = name;
		}

		theme.value = (
			document.getElementById("themes") as HTMLSelectElement
		).value;
	};

	return (
		<dialog id="accountModal" className="modal">
			<div className="modal-box w-max space-y-6">
				<h3 className="font-bold text-lg mb-3">Profile</h3>
				<div className="flex flex-col items-start space-y-2">
					<label htmlFor="accountName">Username</label>
					<input
						id="accountName"
						type="text"
						placeholder={username.value}
						onInput={(ev) => (name = ev.currentTarget.value)}
						className="input input-bordered"
					/>
				</div>
				<div className="flex flex-col items-start space-y-2">
					<label htmlFor="themes">Theme</label>
					<select
						name="themes"
						id="themes"
						value={theme}
						className="select select-bordered w-full"
					>
						{themes.map((theme) => (
							<option key={theme}>{theme}</option>
						))}
					</select>
				</div>
				<div className="modal-action mt-3">
					<form className="w-full" method="dialog">
						<button className="btn btn-primary w-full" onClick={submit}>
							Save
						</button>
					</form>
				</div>
			</div>
		</dialog>
	);
}
