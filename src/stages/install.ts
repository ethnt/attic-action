import * as core from "@actions/core";
import { exec } from "@actions/exec";
import { findInPath } from "@actions/io";

export const install = async () => {
	core.startGroup("Install Attic");

	core.info("Installing Attic");

	const installCommand = core.getInput("install-command");
	const inputsFrom = core.getInput("inputs-from");

	const execInstall = (() => {
		if (installCommand) return exec(installCommand);
		if (inputsFrom) exec("nix", ["profile", "add", "--inputs-from", inputsFrom, "nixpkgs#attic-client"]);
		return exec("nix", ["profile", "add", "github:NixOS/nixpkgs/nixpkgs-unstable#attic-client"]);
	})();

	try {
		await execInstall;
	} catch (e) {
		core.setFailed(`Action failed with error: ${e}`);
	}

	core.endGroup();
};

export const isInstalled = async () => {
	return (await findInPath("attic")).length > 0;
};
