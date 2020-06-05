import { Command } from "@oclif/command";
import { bearExec } from "../utils/bear-exec";
import cmdFlags from "../utils/flags";

export default class ChangeFont extends Command {
  static description = "Change the selected Bear Font.";

  static flags = {
    help: cmdFlags.help,
    "show-window": cmdFlags["show-window"]
  };

  static args = [
    {
      name: "font",
      description: "font name",
      available: [
        "Avenir Next",
        "System",
        "Helvetica Neue",
        "Menlo",
        "Georgia",
        "Courier",
        "Open Dyslexic"
      ],
      required: true
    }
  ];

  async run() {
    const { args, flags } = this.parse(ChangeFont);
    const params = { ...flags, ...args };

    try {
      await bearExec("change-font", params);
    } catch (error) {
      this.error(error, { exit: 1 });
    }
  }
}